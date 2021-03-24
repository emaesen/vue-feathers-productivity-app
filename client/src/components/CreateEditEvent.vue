<template>
  <div :class="[{form: showForm}, {border: showForm && !isEdit}]">
    <transition name="fade">
      <button
        v-if="!showForm && !isEdit"
        class="action button absolute top right spaced"
        @click="openEventForm"
      >
        <font-awesome-icon icon="plus-circle"/>add event
      </button>
    </transition>
    <transition name="slidefade">
      <div v-if="showForm" @keydown.s="onKeydownS">
        <div class>
          <div class>
            <label for="title">
              Event title
              <span v-if="!showError && !isValid" class="req">(required)</span>
              <span v-if="showError" class="error">Please provide a title</span>
            </label>
            <input
              id="title"
              name="title"
              class="title"
              type="text"
              maxlength="108"
              v-model="title"
              placeholder="Event title"
              required
            >
          </div>
          <div class>
            <label for="description">Event description</label>
            <textarea
              id="description"
              name="description"
              v-model="description"
              :style="{height: textAreaHeight + 'px'}"
              placeholder="Event description"
            />
          </div>

          <div class="clr-selector">
            <span v-for="clr in colors" :key="clr" class="action button" @click="selectClr(clr)">
              <span
                class="clr check"
                :class="'clr-' + clr"
                :title="clr"
              >{{ clr===color ? "✔" : "" }}</span>
            </span>
          </div>

          <div class>
            <label for="date">
              Date &amp; time
              <span
                v-if="!showError && !isValid"
                class="req"
              >(required)</span>
              <span v-if="showError" class="error">Please provide at least a date</span>
            </label>
            <div v-if="isRecurring">
              <div class="nowrap">
                <span class="divider-word">repeat from</span>
                <input
                  id="date"
                  name="date"
                  v-model="date.start"
                  type="date"
                  placeholder="yyyy-mm-dd"
                  min="new Date()"
                >
                <span class="divider-word">to</span>
                <input
                  id="date-end"
                  name="date-end"
                  v-model="date.end"
                  type="date"
                  placeholder="yyyy-mm-dd"
                  min="new Date()"
                >
              </div>
              <div class="nowrap">
                <span class="divider-word">each event starts at</span>
                <input
                  id="time"
                  name="time"
                  v-model="time.start"
                  type="time"
                  placeholder="hh:mm"
                  step="300"
                >
                <span class="divider-word">and ends at</span>
                <input
                  id="time-end"
                  name="time-end"
                  v-model="time.end"
                  type="time"
                  placeholder="hh:mm"
                  step="300"
                >
              </div>
            </div>
            <div v-else>
              <div class="nowrap">
                <span class="divider-word">event starts</span>
                <input
                  id="date"
                  name="date"
                  v-model="date.start"
                  type="date"
                  placeholder="yyyy-mm-dd"
                  min="new Date()"
                >
                <input
                  id="time"
                  name="time"
                  v-model="time.start"
                  type="time"
                  placeholder="hh:mm"
                  step="300"
                >
              </div>
              <div class="nowrap">
                <span class="divider-word">event ends</span>
                <input
                  id="time-end"
                  name="time-end"
                  v-model="time.end"
                  type="time"
                  placeholder="hh:mm"
                  step="300"
                >
                <input
                  id="date-end"
                  name="date-end"
                  v-model="date.end"
                  type="date"
                  placeholder="yyyy-mm-dd"
                  min="new Date()"
                >
              </div>
            </div>
          </div>

          <div class="group">
            <div class="cell">
              <label>
                Repeat every week
              </label>
              <span class="expl">└ on ➔</span>
              <div class="weekday" v-for="(day, index) in week" :key="'evt'+day">
                <input type="checkbox" :id="'evt'+day" :value="index" v-model="weekdays">
                <label :for="'evt'+day" class="action button checkbox">
                  <span class="day" :class="day">{{ day }}</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label for="category">Category</label>
            <input
              id="category"
              name="category"
              type="text"
              v-model="category"
              placeholder="type new or select below"
            >
            <div class="categories">
              <span class="expl">└ select ➔</span>
              <div class="category" v-for="cat in categories" :key="cat">
                <button
                  class="action cat"
                  v-if="cat && cat.length>0"
                  @click="category=cat"
                >{{ cat }}</button>
              </div>
            </div>
          </div>

          <div class>
            <button class="action button" @click="save" :disabled="!isValid">
              <font-awesome-icon icon="check-circle"/>save
            </button>
            <button class="action button" @click="cancel">
              <font-awesome-icon icon="ban"/>cancel
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import calendarUtils from "../utils/calendar";

export default {
  name: "CreateEditEvent",
  props: {
    event: {
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
      title: (this.event && this.event.title) || "",
      description: (this.event && this.event.description) || "",
      date: {
        start: (this.event && this.event.date && this.event.date.start) || "",
        end: (this.event && this.event.date && this.event.date.end) || ""
      },
      time: {
        start: (this.event && this.event.time && this.event.time.start) || "",
        end: (this.event && this.event.time && this.event.time.end) || ""
      },
      weekdays: (this.event && this.event.weekdays) || [],
      category: (this.event && this.event.category) || "",
      color: (this.event && this.event.color) || "",
      showForm: !!(this.event && this.event.title),
      showError: false,
      week: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      colors: ["", "red", "blue", "green", "yellow", "purple"]
    };
  },
  updated() {
    // pre-set start date for a new event if we know the current day
    if (
      this.calendar &&
      this.calendar.dayInFocus &&
      !this.date.start &&
      !this.isEdit
    ) {
      this.date.start = calendarUtils.yyyy_mm_dd(this.calendar.dayInFocus.date);
    }
  },
  computed: {
    ...mapGetters(["calendar"]),
    isEdit() {
      return !!(this.event && this.event.title);
    },
    isRecurring() {
      return this.weekdays && this.weekdays.length > 0;
    },
    isValid() {
      // cover basic isValid conditions
      const hasTitle = !!(this.title && this.title !== "");
      const hasRegularDate = !!(
        this.date.start &&
        ((!this.time.start && !this.time.end) ||
          (this.time.start && this.time.end))
      );
      /*
      const hasRegularDateProperty =
        !!this.date.start ||
        !!this.time.start ||
        !!this.date.end ||
        !!this.time.end;
      */
      const hasRecurringDateProperty =
        this.weekdays.length > 0;
      const endDateIsAfterStartDate =
        new Date(
          (this.date.end || this.date.start) +
            "T" +
            (this.time.end || "00:00") +
            ":00"
        ).getTime() >
        new Date(
          this.date.start + "T" + (this.time.start || "00:00") + ":00"
        ).getTime();
      const hasStartAndEndDates =
        !!this.date.start && !!this.date.end;
      const hasConflict =
        !!(this.time.end && !this.time.start) ||
        !!(this.date.end && !this.date.start) ||
        !endDateIsAfterStartDate ||
        (hasRecurringDateProperty && !hasStartAndEndDates);

      return hasTitle && (hasRegularDate) && !hasConflict;
    },
    textAreaHeight() {
      const minHeight = 150;
      return this.contentHeight > minHeight ? this.contentHeight : minHeight;
    }
  },
  methods: {
    openEventForm() {
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
      this.closeEventForm();
    },
    closeEventForm() {
      if (this.isEdit) {
        this.resetEventForm();
      } else {
        this.clearEventForm();
      }
    },
    resetEventForm() {
      this.title = this.event.title;
      this.description = this.event.description;
      this.date = this.event.date;
      this.time = this.event.time;
      this.weekdays = this.event.weekdays;
      this.category = this.event.category;
      this.color = this.event.color;
    },
    clearEventForm() {
      this.title = "";
      this.description = "";
      this.date = { start: "", end: "" };
      this.time = { start: "", end: "" };
      this.weekdays = [];
      this.category = "";
      this.color = "";
      this.showForm = false;
    },
    save() {
      const msgType = this.isEdit ? "edit-event" : "create-event";
      this.showError = false;
      if (this.title.length > 0) {
        this.$emit(msgType, {
          title: this.title,
          description: this.description,
          date: this.date,
          time: this.time,
          weekdays: this.weekdays,
          category: this.category,
          color: this.color
        });
        this.closeEventForm();
      } else {
        this.showError = true;
      }
    },
    onKeydownS(evt) {
      if (evt.ctrlKey) {
        evt.stopPropagation();
        evt.preventDefault();
        this.save();
      }
    }
  }
};
</script>

<style scoped>
input#description {
  width: 80%;
}
.form {
  background-color: #212027;
  border: 1px solid #212027;
  border-radius: 10px;
  padding: 5px;
  margin-bottom: 5px;
}
input[type="number"] {
  width: 4rem;
}
.border {
  border: 1px solid #555;
  border-radius: 10px;
  padding: 5px;
  margin-bottom: 5px;
}
.date {
  display: inline-block;
}
.divider-word {
  margin: 0 1em;
}
.expl {
  margin-left: 0.5em;
}
.divider-word,
.expl {
  color: #929292;
}
.req,
.error {
  font-weight: normal;
  font-style: italic;
  margin-left: 1em;
  letter-spacing: normal;
}
.req {
  color: #ffbc00ab;
}
.error {
  color: #ffbc00;
}
.weekday,
label.checkbox,
input[type="checkbox"] {
  display: inline-block;
}
input[type="checkbox"] {
  visibility: hidden;
  width: 1em;
}
input[type="checkbox"]:checked + label::before {
  content: "✓ ";
  margin-left: -1.2em;
  color: #29dc58;
}
input.title {
  min-width: 250px;
  width: 75%;
}
.categories {
  margin-top: -0.75em;
}
.category {
  display: inline-block;
}
.clr-selector {
  margin-bottom: 1em;
}
button.action.cat {
  margin-left: 0.3em;
}
.clr.check {
  color: #29dc58;
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
