<template>
  <q-page class="row items-center justify-evenly q-px-sm">
    <div class="stacked-label full-width">
      <label>SPARQL Query</label>
      <textarea class="full-width" rows="20" v-model="query"></textarea>
      <pre v-if="error" :class="{'bg-red-11': error}">{{ resp }}</pre>
      <q-btn @click="doQuery">Run</q-btn>
    </div>
    <csv-table class="full-width" v-if="!error && resp" :csv="resp" />
    <graph-vis class="full-width" v-if="!error && resp" :csv="resp" />
  </q-page>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {anzo} from 'src/boot/axios'
import GraphVis from 'src/components/GraphVis.vue'
import CsvTable from 'src/components/CsvTable.vue'
import {AxiosError} from 'axios'
import {prefix} from '../helpers/rdf'

const query = ref<string>(`PREFIX dct: <http://purl.org/dc/terms/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX resource: <https://biomedit.ch/rdf/sphn-resource/>
PREFIX sphn: <https://biomedit.ch/rdf/sphn-ontology/sphn#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT ?s ?p ?o
FROM <http://nexus.ethz.ch/sphn>
WHERE {
  ?s ?p ?o .
}`)
const resp = ref<string>()
const error = ref<boolean>(false)

const doQuery = async () => {
  try {
    error.value = false
    const r = await anzo.get('/sparql', {
      params: {
        query: query.value,
      },
    })
    resp.value = prefix(query.value, r.data)
  } catch (err) {
    console.error(err)
    error.value = true
    if (err) {
      if ((err as AxiosError<string, string>).response?.data) {
        resp.value = (err as AxiosError<string, string>).response?.data
      }
    }
  }
}
</script>
