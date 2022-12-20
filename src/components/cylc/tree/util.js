/**
 * Copyright (C) NIWA & British Crown (Met Office) & Contributors.
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import TaskState from '@/model/TaskState.model'

/**
 * This gets all the latest tasks from all descendant nodes, for states which are valid and which haven't already been added
 *
 */
export function getLatestDescendentTasks (node) {
  const validValues = [
    TaskState.SUBMITTED.name,
    TaskState.SUBMIT_FAILED.name,
    TaskState.RUNNING.name,
    TaskState.SUCCEEDED.name,
    TaskState.FAILED.name
  ]
  const tasks = {}
  const traverseChildren = (currentNode) => {
    // if we aren't at the end of the node tree, continue
    if (currentNode.children.length > 0) {
      traverseChildren(currentNode.children[0])
    } else {
      // if we are at the end of the tree, and the end of the tree is of type workflow, fetch the states from the latestStateTasks property
      if (currentNode.type === 'workflow') {
        Object.keys(currentNode.node.latestStateTasks)
          // filter only valid states
          .filter(stateTaskKey => validValues.includes(stateTaskKey))
          // concat the new tasks in where they dont already exist
          .forEach((key) => {
            if (!tasks[key]) {
              tasks[key] = []
            }
            tasks[key] = [].concat(tasks[key], currentNode.node.latestStateTasks[key].filter(newTask => !tasks[key].includes(newTask)))
          })
      }
    }
  }
  traverseChildren(node)
  return tasks
}

export function getLastDescendent (node) {
  let lastDescendent = node
  const traverseChildren = (currentNode) => {
    if (currentNode.children.length > 0) {
      traverseChildren(currentNode.children[0])
    } else {
      lastDescendent = currentNode
    }
  }
  traverseChildren(node)
  return lastDescendent
}

export function createDescendentLabel (node) {
  const labelArr = []
  const traverseChildren = (currentNode) => {
    labelArr.push(currentNode.name || currentNode.id)
    if (currentNode.children.length > 0) {
      traverseChildren(currentNode.children[0])
    }
  }
  traverseChildren(node)
  return labelArr.join('/')
}

export function checkForBranchingLineage (node) {
  let moreThenTwoChildren = false
  const traverseChildren = (currentNode) => {
    if (moreThenTwoChildren === false && currentNode.children.length > 0) {
      if (currentNode.children.length === 1) {
        traverseChildren(currentNode.children[0])
      } else {
        moreThenTwoChildren = true
      }
    }
  }
  traverseChildren(node)
  return moreThenTwoChildren
}

export function getNodeChildren (node, cyclePointsOrderDesc) {
  // returns child nodes folling the family tree and following sort order
  if (node.type === 'workflow' && !cyclePointsOrderDesc) {
    // a user configuration has configured the sort order for cycle points to
    // be reversed
    return [...node.children].reverse()
  } else if (node.type === 'cycle') {
    // display tasks in the inheritance tree
    const rootFamily = node.familyTree[0]
    if (!rootFamily) {
      return []
    }
    return rootFamily.children
  }
  return node.children
}
