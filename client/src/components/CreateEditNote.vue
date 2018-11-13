<template>
  <div class="">
    <button
      v-show="!showForm && !isEdit"
      class=""
      @click="openNoteForm"
    >
      <i class=""/> Add a note
    </button>
    <div
      v-show="showForm"
      class=""
    >
      <div class="">
        <div class="">
          <div class="">
            <label>Text *</label>
            <textarea
              v-model="text"
            />
          </div>
          <div class="">
            <label>Category</label>
            <textarea
              v-model="category"
            />
          </div>
          <div class="">
            <button
              class="action button"
              @click="save"
            >
              save
            </button>
            <button
              class="action button"
              @click="cancel"
            >
              cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    note: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      text: this.note && this.note.text || '',
      category: this.note && this.note.category || '',
      showForm: !!(this.note && this.note.text)
    };
  },
  computed: {
    isEdit: function(){
      return !!(this.note && this.note.text);
    }
  },
  methods: {
    openNoteForm() {
      this.showForm = true;
    },
    cancel() {
      if (this.isEdit) {
        this.$emit('cancel-edit');
      }
      this.closeNoteForm();
    },
    closeNoteForm() {
      if (this.isEdit) {
        this.resetNoteForm();
      } else {
        this.clearNoteForm();
      }
    },
    resetNoteForm() {
      this.text = this.note.text;
      this.category = this.note.category;
    },
    clearNoteForm() {
      this.text = '';
      this.category = '';
      this.showForm = false;
    },
    save() {
      const msgType = this.isEdit? 'edit-note' : 'create-note';
      if (this.text.length > 0) {
        this.$emit(msgType, {
          text: this.text,
          category: this.category
        });
        this.closeNoteForm();
      } else {
        let txt = (this.text.length === 0)? "Please provide some text." : "";
        this.$emit(msgType + '-warning', {
          title: 'Missing input',
          text: txt
        });
      }
    },
  },
};
</script>

<style scoped>
textarea {
  min-height:4em;
  height:8em;
}
</style>
