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
  <v-container class="c-user-profile">
    <v-layout wrap>
      <v-flex xs12 md12>
        <v-alert
          :icon="svgPaths.settings"
          prominent
          color="grey lighten-3"
        >
          <h3 class="headline">{{ $t('UserProfile.tableHeader') }}</h3>
          <p class="body-1">{{ $t('UserProfile.tableSubHeader') }}</p>
        </v-alert>
        <v-form v-if="user !== null">
          <v-container py-0>
            <v-layout row align-center wrap>
              <v-flex xs3>
                <span>{{ $t('UserProfile.username') }}</span>
              </v-flex>
              <v-flex xs9>
                <v-text-field
                    :value="user.username"
                    disabled
                    id="profile-username"
                    aria-disabled="true"
                    class="body-1"
                />
              </v-flex>
            </v-layout>

            <v-layout row align-center wrap>
              <v-flex xs3>
                <span>{{ $t('UserProfile.administrator') }}</span>
              </v-flex>
              <v-flex xs9>
                <v-checkbox
                    v-model="user.admin"
                    disabled
                    id="profile-admin"
                    aria-disabled="true"
                    class="body-1"
                />
              </v-flex>
            </v-layout>

            <v-layout row align-center wrap>
              <v-flex xs3>
                <span>{{ $t('UserProfile.groups') }}</span>
              </v-flex>
              <v-flex xs9>
                <v-select
                    :items="user.groups"
                    v-model="user.groups"
                    attach
                    multiple
                    disabled
                    id="profile-groups"
                    aria-disabled="true"
                    class="body-1"
                />
              </v-flex>
            </v-layout>

            <v-layout row align-center wrap>
              <v-flex xs3>
                <span>{{ $t('UserProfile.created') }}</span>
              </v-flex>
              <v-flex xs9>
                <v-text-field
                    :value="user.created"
                    disabled
                    id="profile-created"
                    aria-disabled="true"
                    class="body-1"
                />
              </v-flex>
            </v-layout>

            <v-row mt-4>
              <v-flex xs12>
                <p class="title">Preferences</p>
              </v-flex>
            </v-row>

            <v-layout row align-center wrap>
              <v-flex xs3>
                <span>Font size</span>
              </v-flex>
              <v-flex xs9>
                <v-btn
                  depressed
                  id="font-size-reset-button"
                  class="mr-2"
                  @click="resetFontSize()">
                  Reset
                </v-btn>
                <v-btn
                  depressed
                  id="font-size-decrease-button"
                  class="mx-2"
                  @click="decreaseFontSize()">
                  <v-icon>{{ svgPaths.decrease }}</v-icon>
                </v-btn>
                <v-btn
                  depressed
                  id="font-size-increase-button"
                  class="ml-2"
                  @click="increaseFontSize()">
                  <v-icon>{{ svgPaths.increase }}</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>

            <v-layout row align-center wrap>
              <v-flex xs3>
                <span>Colour Theme</span>
              </v-flex>
                <v-radio-group v-model="jobTheme" column>
                  <table class="c-job-state-table">
                    <tr>
                      <th>State</th>
                      <th
                        v-for="theme in jobThemes"
                        v-bind:key="theme"
                      >
                        {{theme}}
                      </th>
                    </tr>
                    <tr
                    >
                      <td></td>
                      <td
                        v-for="theme in jobThemes"
                        v-bind:key="theme"
                      >
                        <v-radio
                          :value="theme"
                          v-bind:id="`input-job-theme-${theme}`"
                        />
                      </td>
                    </tr>
                    <tr
                      v-for="state in jobStates"
                      v-bind:key="state"
                    >
                      <td>{{state}}</td>
                      <td
                        v-for="theme in jobThemes"
                        v-bind:key="theme"
                        v-bind:class="[`job_theme--${theme}`, 'job_theme_override']"
                      >
                        <job :status="state" />
                      </td>
                    </tr>
                  </table>
                </v-radio-group>
              <v-flex xs9>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
        <v-progress-linear v-else :indeterminate="true" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { mixin } from '@/mixins'
import {
  resetFontSize,
  decreaseFontSize,
  increaseFontSize,
  getCurrentFontSize
} from '@/utils/font-size'
import { mdiCog, mdiFormatFontSizeIncrease, mdiFormatFontSizeDecrease } from '@mdi/js'
import Job from '@/components/cylc/Job'

// TODO: update where user preferences are stored after #335

export default {
  mixins: [mixin],
  components: {
    Job
  },
  data () {
    return {
      svgPaths: {
        settings: mdiCog,
        increase: mdiFormatFontSizeIncrease,
        decrease: mdiFormatFontSizeDecrease
      },
      jobStates: [
        'submitted',
        'running',
        'succeeded',
        'failed',
        'submit-failed'
      ],
      jobThemes: [
        'default',
        'greyscale',
        'colour_blind'
      ],
      jobTheme: localStorage.jobTheme || 'default'
    }
  },
  computed: {
    ...mapState('user', ['user'])
  },
  metaInfo () {
    return {
      title: this.getPageTitle('App.userProfile')
    }
  },
  methods: {
    resetFontSize,
    decreaseFontSize,
    increaseFontSize,
    getCurrentFontSize,
    ...mapMutations('app', ['setJobTheme'])
  },
  watch: {
    jobTheme: function (theme) {
      this.setJobTheme(theme)
    }
  }
}
</script>
