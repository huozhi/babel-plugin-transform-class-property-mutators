const { declare } = require("@babel/helper-plugin-utils");
const defineMap = require("@babel/helper-define-map");
const { types: t } = require("@babel/core");

function isClassPropertyMutator(prop) {
  return prop.type === "ClassMethod" &&
    (prop.kind === "get" || prop.kind === "set")
}

function definePropertyExpression(object, props) {
  return t.callExpression(
    t.memberExpression(
      t.identifier("Object"),
      t.identifier("defineProperties"),
    ),
    [object, defineMap.toDefineObject(props)],
  );
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
        const prototypeMutatorMap = {};
        const staticMutatorMap = {};

        node.body.body = classBody.filter(prop => {
          if (isClassPropertyMutator(prop)) {
            if (prop.static) {
              defineMap.push(staticMutatorMap, prop, null, file);
            } else {
              defineMap.push(prototypeMutatorMap, prop, null, file);
            }
            return false;
          } else {
            return true;
          }
        });

        if (Object.keys(prototypeMutatorMap).length) {
          const memberProperties = definePropertyExpression(classProto, prototypeMutatorMap);
          path.insertAfter(memberProperties);
        }

        if (Object.keys(staticMutatorMap).length) {
          const staticProperties = definePropertyExpression(classRef, staticMutatorMap);
          path.insertAfter(staticProperties);
        }
      },
    },
  };
});
