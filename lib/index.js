const { declare } = require("@babel/helper-plugin-utils");
const defineMap = require("@babel/helper-define-map");
const { types: t } = require("@babel/core");

function isClassPropertyMutator(prop) {
  return prop.type === "ClassMethod" &&
    (prop.kind === "get" || prop.kind === "set")
}

module.exports = declare(api => {
  api.assertVersion(7);

  return {
    name: "transform-class-mutators",

    visitor: {
      Class(path, file) {
        const { node } = path;
        const classRef = node.id
          ? t.identifier(node.id.name)
          : path.scope.generateUidIdentifier("class");

        const classProto = t.memberExpression(
          classRef,
          t.identifier("prototype"),
        );
        const classBody = node.body.body;
        const mutatorMap = {}
        node.body.body = classBody.filter(prop => {
          if (isClassPropertyMutator(prop)) {
            defineMap.push(mutatorMap, prop, null, file);
            return false;
          } else {
            return true;
          }
        });

        const mutatorsDefinedOnPrototype = t.callExpression(
          t.memberExpression(
            t.identifier("Object"),
            t.identifier("defineProperties"),
          ),
          [classProto, defineMap.toDefineObject(mutatorMap)],
        )

        path.insertAfter(mutatorsDefinedOnPrototype);
      },
    },
  };
});
