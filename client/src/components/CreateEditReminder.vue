<template>
  <div
    :class="[{form: showForm}, {border: showForm && !isEdit}]"
  >
    <transition name="fade">
      <button
        v-if="!showForm && !isEdit"
        class="action button absolute top right"
        @click="openReminderForm"
      >
        <font-awesome-icon icon="plus-circle" /> add reminder
      </button>
    </transition>
    <transition name="slidefade">
      <div
        v-if="showForm"
        class=""
      >
        <div class="">
          <div class="">
            <label>Task or event
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
              Please provide some content
              </span>
            </label>
            <input
              v-model="text"
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
            <label>Due date</label>
            <input
              v-model="date"
              type="date"
            />
            <input
              v-model="time"
              type="time"
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
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    reminder: {
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
      text: (this.reminder && this.reminder.text) || "",
      date: (this.reminder && this.reminder.date) || "",
      time: (this.reminder && this.reminder.time) || "",
      showForm: !!(this.reminder && this.reminder.text),
      showError: false,
      colors: ["", "red", "blue", "green", "yellow", "purple"]
    };
  },
  computed: {
    isEdit() {
      return !!(this.reminder && this.reminder.text);
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
    openReminderForm() {
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
      this.closeReminderForm();
    },
    closeReminderForm() {
      if (this.isEdit) {
        this.resetReminderForm();
      } else {
        this.clearReminderForm();
      }
    },
    resetReminderForm() {
      this.text = this.reminder.text;
      this.date = this.reminder.date;
      this.time = this.reminder.time;
    },
    clearReminderForm() {
      this.text = "";
      this.date = "";
      this.time = "";
      this.showForm = false;
    },
    save() {
      const msgType = this.isEdit ? "edit-reminder" : "create-reminder";
      this.showError = false;
      if (this.text.length > 0) {
        this.$emit(msgType, {
          text: this.text,
          date: this.date,
          time: this.time
        });
        this.closeReminderForm();
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
.date {
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
