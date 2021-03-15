<template>
 <v-card class="pa-4">
   <div class="text-align-right">
     <v-btn
      flat
      icon
      small
      pointer
      class="ma-0 pointer"
      @click="$emit('close')"
     >
       <i
          aria-hidden="true"
          class="icon material-icons vidaxl--text left pointer"
        >
         close
       </i>
     </v-btn>
   </div>
   <div class="text-xs-center font-weight-bold subheading mb-2">
     {{ localize('auction.choose_nickname_title') }}
   </div>
   <div>
     {{ localize('auction.choose_nickname_description') }}
   </div>
   <form @submit.prevent="submit">
     <v-text-field
       ref="nickName"
       v-model="nickName"
       :rules="[rules.required]"
       class="mb-2 nickname__input"
     >
        <span slot="label">
          {{ localize('auction.choose_nickname_label') }}
        </span>
     </v-text-field>
     <v-btn
       class="set-nickname__btn"
       type="submit"
       color="primary full-width ma-0"
     >
       {{ localize('auction.choose_nickname') }}
     </v-btn>
   </form>
 </v-card>
</template>

<script>
import VCard from 'vuetify/es5/components/VCard/VCard'
import VBtn from 'vuetify/es5/components/VBtn/VBtn'
import VTextField from 'vuetify/es5/components/VTextField'

export default {
  name: 'NicknameDialog',
  components: {
    VBtn, VCard, VTextField
  },
  data () {
    return {
      nickName: '',
      rules: {
        required: value => !!value || this.localize('auction.error')
      }
    }
  },
  methods: {
    submit () {
      this.$refs.nickName.validate(true)
      if (!this.nickName) return

      this.$emit('submit', this.nickName)
    }
  }
}
</script>
