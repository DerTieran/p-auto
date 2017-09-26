'use strict';

const pDerfer = require('p-defer');
const pProps = require('p-props');

const auto = tasks => Promise.resolve(tasks)
  .then(tasks => {
    const keys = Object.keys(tasks);

    const deferedTasks = {};
    const getDeferedTask = key => {
      if (!deferedTasks[key]) {
        deferedTasks[key] = pDerfer();
      }
      return deferedTasks[key];
    };

    const promisedTasks = keys.reduce((promised, key) => {
      const task = Array.isArray(tasks[key]) ? tasks[key] : [tasks[key]];

      const dependencies = task.slice(0, task.length - 1).reduce((dependencies, dependency) => {
        if (Object.prototype.hasOwnProperty.call(tasks, dependency) === false) {
          throw new Error(`Non existing dependency ${dependency} in ${key}`);
        }
        dependencies[dependency] = getDeferedTask(dependency).promise;
        return dependencies;
      }, {});

      let resolver = task[task.length - 1];
      if (typeof resolver !== 'function') {
        const value = resolver;
        resolver = () => value;
      }

      const defered = getDeferedTask(key);
      defered.resolve(pProps(dependencies).then(resolver));

      promised[key] = defered.promise;
      return promised;
    }, {});

    return pProps(promisedTasks);
  });

module.exports = auto;
