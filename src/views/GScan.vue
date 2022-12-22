<!--
Copyright (C) NIWA & British Crown (Met Office) & Contributors.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
-->

<template>
  <GScanComponent
    :workflows="workflows"
    :isLoading="isLoading"
  />
</template>

<script>
import { mapState } from 'vuex'
import subscriptionComponentMixin from '@/mixins/subscriptionComponent'
import SubscriptionQuery from '@/model/SubscriptionQuery.model'
import { GSCAN_DELTAS_SUBSCRIPTION } from '@/graphql/queries'
import { sortedWorkflowTree } from '@/components/cylc/gscan/sort.js'
import GScanComponent from '@/components/cylc/gscan/GScan'

export default {
  name: 'GScan',
  components: {
    GScanComponent
  },
  mixins: [
    subscriptionComponentMixin
  ],
  data () {
    return {
      query: new SubscriptionQuery(
        GSCAN_DELTAS_SUBSCRIPTION,
        {},
        'root',
        []
      )
    }
  },
  computed: {
    ...mapState('workflows', ['cylcTree']),
    workflows () {
      if (!this.cylcTree?.children.length) {
        // no user in the data store (i.e. data loading)
        return []
      }
      return sortedWorkflowTree(this.cylcTree)
    }
  }
}
</script>
