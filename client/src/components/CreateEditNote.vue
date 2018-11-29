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
                :style="{height: textAreaHeight + 'px'}"
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
                placeholder="type new or select below"
              />
              <div class="categories">
                <span class="expl">└ select ➔</span>
                <div class="category"
                  v-for="cat in categories"
                  :key="cat"
                >
                  <button class="action"
                    v-if="cat.length>0"
                    @click="category=cat"
                  >
                    {{ cat }}
                  </button>
                </div>
              </div>
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
      default() {
        return {};
      }
    },
    categories: {
      type: Array
    },
    contentHeight: {
      type: Number
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
    isEdit() {
      return !!(this.note && this.note.text);
    },
    isValid() {
      return this.text;
    },
    textAreaHeight() {
      const minHeight = 150;
      return this.contentHeight > minHeight ? this.contentHeight : minHeight;
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
.categories {
  margin-top: -0.75em;
}
.category {
  display: inline-block;
}
.expl {
  margin-left: 0.5em;
  color: #929292;
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
