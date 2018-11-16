<template>
  <div class="">
    <transition name="fade">
      <button
        v-if="!showForm && !isEdit"
        class="action button absolute top right"
        @click="openNoteForm"
      >
        <font-awesome-icon icon="plus-circle" /> add note
      </button>
    </transition>
    <transition name="slidefade">
      <div
        v-if="showForm"
        class=""
      >
        <div class="">
          <div class="">
            <div class="">
              <label>Content
                <span
                  v-if="!showError && !isValid"
                  class="req"
                >
                  (required)
                </span>
                <span
                  v-if="showError"
                  class="error"
                >
                  Please provide some content text
                </span>
              </label>
              <textarea
                v-model="text"
              />
            </div>
            <div class="">
              <label>Category</label>
              <input
                v-model="category"
              />
            </div>
            <div class="">
              <button
                class="action button"
                @click="save"
                :disabled="!isValid"
              >
                <font-awesome-icon icon="check-circle" /> save
              </button>
              <button
                class="action button"
                @click="cancel"
              >
                <font-awesome-icon icon="ban" /> cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
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
      showForm: !!(this.note && this.note.text),
      showError: false

    };
  },
  computed: {
    isEdit: function() {
      return !!(this.note && this.note.text);
    },
    isValid: function() {
      return this.text;
    }
  },
  methods: {
    openNoteForm() {
      this.showForm = true;
      this.showError = false;
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
      this.showError = false;
      if (this.text.length > 0) {
        this.$emit(msgType, {
          text: this.text,
          category: this.category
        });
        this.closeNoteForm();
      } else {
        this.showError = true;
      }
    },
  },
};
</script>

<style scoped>
.req, .error {
  font-style: italic;
  margin-left: 1em;
}
.req {
  color:#ffbc00ab;
}
.error {
  color:#ffbc00;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s, transform 1s;
  transform: scaleY(1);
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: scaleY(0);
}
.slidefade-enter-active, .slidefade-leave-active {
  transition: opacity 1s, transform 1s, max-height 2s;
  transform: scaleY(1);
  max-height: 50em;
}
.slidefade-enter, .slidefade-leave-to {
  opacity: 0;
  transform: scaleY(0);
  max-height: 0;
}
</style>
