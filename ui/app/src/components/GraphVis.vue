<script setup lang="ts">
import {computed, reactive, ref, onMounted} from 'vue'
import {Nodes, Edges, Layouts, defineConfigs, VNetworkGraphInstance} from 'v-network-graph'
import 'v-network-graph/lib/style.css'
import * as Papa from 'papaparse'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dagre from 'dagre/dist/dagre.min.js'

const nodeSize = 200

const props = defineProps({
  csv: {
    type: String,
    required: true,
  },
  sourceCol: {
    type: String,
    default: 's',
  },
  targetCol: {
    type: String,
    default: 'o',
  },
  edgeCol: {
    type: String,
    default: 'p',
  },
})

const parsed = computed(() => {
  return Papa.parse<{[key: string]: string}>(props.csv, {
    header: true,
    skipEmptyLines: true,
  })
})

const nodes = computed(() => {
  const nodes: Nodes = {}
  if (parsed.value) {
    for (const triple of parsed.value.data) {
      for (const nodeCol of [props.sourceCol, props.targetCol]) {
        nodes[triple[nodeCol]] = {
          id: triple[nodeCol],
          name: triple[nodeCol],
        }
      }
    }
  }
  return nodes
})

const edges = computed(() => {
  const edges: Edges = {}
  if (parsed.value) {
    for (const [idx, triple] of parsed.value.data.entries()) {
      edges[`edge${idx}`] = {
        source: triple[props.sourceCol],
        target: triple[props.targetCol],
        label: triple[props.edgeCol],
      }
    }
  }
  return edges
})

const layouts: Layouts = reactive({
  nodes: {},
})

const configs = defineConfigs({
  view: {
    autoPanAndZoomOnLoad: 'fit-content',
    onBeforeInitialDisplay: () => layout('TB'),
  },
  node: {
    normal: {
      type: 'rect',
      radius: nodeSize / 10,
      width: nodeSize / 10,
      height: nodeSize / 10,
      color: '#4FC3F7',
    },
    label: {visible: true, direction: 'south', directionAutoAdjustment: true, color: '#000'},
  },
  edge: {
    normal: {
      color: '#aaa',
      width: 3,
    },
    margin: 4,
    type: 'curve',
    marker: {
      target: {
        type: 'arrow',
        width: 4,
        height: 4,
      },
    },
    label: {
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: 11,
      lineHeight: 1.1,
      color: '#000000',
      margin: 4,
      background: {
        visible: false,
        color: '#ffffff',
        padding: {
          vertical: 1,
          horizontal: 4,
        },
        borderRadius: 2,
      },
    },
  },
})
const graph = ref<VNetworkGraphInstance>()

const layout = (direction: 'TB' | 'LR') => {
  if (Object.keys(nodes.value).length <= 1 || Object.keys(edges.value).length == 0) {
    return
  }

  // convert graph
  // ref: https://github.com/dagrejs/dagre/wiki
  const g = new dagre.graphlib.Graph()
  // Set an object for the graph label
  g.setGraph({
    rankdir: direction,
    nodesep: nodeSize * 2,
    edgesep: nodeSize,
    ranksep: nodeSize * 2,
  })
  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(() => ({}))

  // Add nodes to the graph. The first argument is the node id. The second is
  // metadata about the node. In this case we're going to add labels to each of
  // our nodes.
  Object.entries(nodes.value).forEach(([nodeId, node]) => {
    g.setNode(nodeId, {label: node.name, width: nodeSize, height: nodeSize})
  })

  // Add edges to the graph.
  Object.values(edges.value).forEach(edge => {
    g.setEdge(edge.source, edge.target)
  })

  dagre.layout(g)

  g.nodes().forEach((nodeId: string) => {
    // update node position
    console.debug('nodeId', nodeId)
    const x = g.node(nodeId).x
    const y = g.node(nodeId).y
    layouts.nodes[nodeId] = {x, y}
  })
}

const updateLayout = (direction: 'TB' | 'LR') => {
  // Animates the movement of an element.
  graph.value?.transitionWhile(() => {
    layout(direction)
  })
}

onMounted(() => {
  updateLayout('TB')
})
</script>

<template>
  <!-- <pre>{{ nodes }}</pre>
  <pre>{{ edges }}</pre> -->
  <v-network-graph
    class="graph"
    :zoom-level="0.5"
    :nodes="nodes"
    :edges="edges"
    :layouts="layouts"
    :configs="configs">
    <template #edge-label="{edge, ...slotProps}">
      <v-edge-label :text="edge.label" align="center" vertical-align="above" v-bind="slotProps" />
    </template>
  </v-network-graph>
</template>

<style scoped lang="sass">
.graph
  height: calc(100vh - 100px)
  background-color: #eee
</style>
