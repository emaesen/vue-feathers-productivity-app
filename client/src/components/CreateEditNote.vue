<template>
  <div
    :class="[{form: showForm}, {border: showForm && !isEdit}]"
  >
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
                :class="'clr-' + color"
              />
            </div>
            <div class="clr-selector">
              <span
                v-for="clr in colors"
                :key="clr"
                class="clr"
                :class="'clr-' + clr"
                :title="clr"
                @click="selectClr(clr)"
              >&nbsp;</span>
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
        return {};
      }
    }
  },
  data() {
    return {
      text: (this.note && this.note.text) || "",
      category: (this.note && this.note.category) || "",
      color: (this.note && this.note.color) || "",
      showForm: !!(this.note && this.note.text),
      showError: false,
      colors: ["", "red", "blue", "green", "yellow", "purple"]
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
    selectClr(clr) {
      this.color = clr;
    },
    cancel() {
      if (this.isEdit) {
        this.$emit("cancel-edit");
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
      this.color = this.note.color;
    },
    clearNoteForm() {
      this.text = "";
      this.category = "";
      this.color = "";
      this.showForm = false;
    },
    save() {
      const msgType = this.isEdit ? "edit-note" : "create-note";
      this.showError = false;
      if (this.text.length > 0) {
        this.$emit(msgType, {
          text: this.text,
          category: this.category,
          color: this.color
        });
        this.closeNoteForm();
      } else {
        this.showError = true;
      }
    }
  }
};
</script>

<style scoped>
.form {
  background-color: #212027;
  border: 1px solid #212027;
  border-radius: 10px;
  padding: 5px;
  margin-bottom: 5px;
}
.border {
  border: 1px solid #555;
  border-radius: 10px;
  padding: 5px;
  margin-bottom: 5px;
}
.req,
.error {
  font-style: italic;
  margin-left: 1em;
}
.req {
  color: #ffbc00ab;
}
.error {
  color: #ffbc00;
}
.clr-selector {
  margin-bottom: 1em;
}
.clr {
  cursor: pointer;
  display: inline-block;
  border: 1px solid #555;
  border-radius: 10px;
  margin: 0 5px;
  vertical-align: middle;
  width: 25px;
  height: 25px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s, transform 1s;
  transform: scaleY(1);
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0);
}
.slidefade-enter-active,
.slidefade-leave-active {
  transition: opacity 1s, transform 1s, max-height 2s;
  transform: scaleY(1);
  max-height: 50em;
}
.slidefade-enter,
.slidefade-leave-to {
  opacity: 0;
  transform: scaleY(0);
  max-height: 0;
}
</style>
