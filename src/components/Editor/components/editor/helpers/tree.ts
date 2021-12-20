import { CustomText } from '../../../custom-types'
import { Text, Node, NodeEntry } from 'slate'

export const getTextNode = (nodeEntry: NodeEntry): NodeEntry<CustomText> => {
  const [node, path] = nodeEntry
  if (Text.isText(node)) {
    return [node as CustomText, path]
  } else {
    let nearest: NodeEntry<CustomText>
    let distance = 100
    for (const [n, p] of Node.descendants(node)) {
      // console.log(n, p)
      // we want the shallowest child
      const newDistance = p.length
      if (Text.isText(n) && !n.bookend && newDistance <= distance) {
        distance = newDistance
        nearest = [n, p]
      }
    }
    const nearestNode = nearest[0] as CustomText
    const nearestPath = path.concat(nearest[1])
    return [nearestNode, nearestPath]
  }
}
