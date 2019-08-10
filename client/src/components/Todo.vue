<template>
  <div class="cell todos-list-cell" :class="dueClass">
    <div :id="'todo-'+todo._id" class="todo">
      <transition name="fade" mode="out-in" @after-enter="editTransitionComplete">
        <div
          v-if="!isEditing"
          class="actionable trans"
          :class="{collapsed: isCollapsed}"
          @click="toggleCollapse"
          :style="{
            maxHeight: maxTodoHeight + 'px',
            'transition-duration': transitionDuration + 's'
          }"
        >
          <div ref="content" :class="dueClass">
            <div class="inline-block float right right-margin5">
              <font-awesome-icon
                v-if="isCollapsed && transitionType==='start'"
                icon="play"
                @click="transitionTodo(todo)"
              />
              <font-awesome-icon
                v-if="isCollapsed && transitionType==='complete'"
                icon="stop"
                @click="transitionTodo(todo)"
              />
            </div>
            <div class="category">
              <font-awesome-icon icon="thumbtack" v-if="showPin"/>
              {{ todo.category }}
            </div>
            <div v-if="todoIsComplete" class="elapsed">{{ storedElapsedTime }}</div>
            <div class="due" :class="dueClass">{{ due }}</div>
            <div class="content-text" :class="'clr-' + todo.color">
              <div class="todo-title">{{ todo.title }}</div>
              <div v-if="todo.description" class="todo-description" v-html="descriptionAsHtml"/>
              <div v-if="todo.note" class="todo-note info" v-html="noteAsHtml"/>
            </div>
            <div class="action-row" :class="{hidden:isCollapsed}">
              <button class="action button" title="edit" @click="showForm">
                <font-awesome-icon icon="edit"/>edit
              </button>

              <transition name="fade" mode="out-in">
                <button
                  v-if="!isDeleteClicked"
                  class="action button"
                  title="delete"
                  @click="deleteTodo(todo)"
                >
                  <font-awesome-icon icon="trash-alt"/>delete
                </button>
                <div v-if="isDeleteClicked" class="confirm">
                  Confirm Delete:
                  <button
                    class="action button"
                    title="delete"
                    @click="deleteTodo(todo, true)"
                  >
                    <font-awesome-icon icon="trash-alt"/>yes!
                  </button>
                  <button class="action button" title="delete" @click="deleteTodo(todo, false)">
                    <font-awesome-icon icon="ban"/>no
                  </button>
                </div>
              </transition>

              <button
                v-if="todoIsInProgress"
                class="action button"
                title="flip hourglass"
                @click="toggleTimer(todo)"
              >{{ timerButtonText }}
                <font-awesome-icon v-if="isTimerRunning" icon="hourglass-start"/>
                <font-awesome-icon v-if="!isTimerRunning" icon="hourglass-end"/>
                {{ elapsedTime }}
                <span class="demph">{{ storedElapsedTime }}</span>
              </button>
            </div>
            <div class="action-row" :class="{hidden:isCollapsed}">
              <button
                v-if="transitionType==='start'"
                class="action button full-width"
                title="start this task"
                @click="transitionTodo(todo)"
              >Start this task
                <font-awesome-icon icon="play"/>
              </button>
              <button
                v-if="transitionType==='complete'"
                class="action button full-width"
                title="complete this task"
                @click="transitionTodo(todo)"
              >Complete this task
                <font-awesome-icon icon="stop"/>
              </button>
            </div>
          </div>
        </div>
        <pa-edit-todo
          v-if="isEditing"
          :todo="todo"
          :categories="categories"
          :contentHeight="maxTodoHeight"
          @edit-todo="editTodo"
          @cancel-edit="cancelEdit"
          @edit-todo-warning="editTodoWarning"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import calendarUtils from "../utils/calendar";
import EditTodo from "./CreateEditTodo";
import { mapGetters } from "vuex";

const DUETEXTWINDOWDAYS = 7;
const DUEWARNINGWINDOWDAYS = 1;

const STATUS = {
  OPEN: "open",
  PROGRESS: "progress",
  COMPLETE: "complete"
};

// allow limited markdown-inspired formatting
function simpleFormat(inp) {
  return (
    inp &&
    inp
      .replace(/\r/, "")
      .replace(/</g, "&lt;")
      .replace(/\n *\* /g, "\n⩺ ")
      .replace(/----+\n/g, "<hr>")
      .replace(/```\n([^`]+)\n```\n/g, "<pre>$1</pre>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<i>$1</i>")
      .replace(/ {2}-/g, "⋯-")
      .replace(/^(⋯?)- (.*)\n/gm, "$1⋞$2\n")
      .replace(/^([^⋞]*\n)⋞/gm, "$1⋐\n⋞")
      .replace(/^(⋞.+\n)⋯⋞/gm, "$1⋯⋐\n⋯⋞")
      .replace(/^(⋯⋞.+\n)⋞/gm, "$1⋯⋑\n⋟\n⋞")
      .replace(/^(⋯?⋞.+[^⋟])(\n⋯(⋑|⋞))/gm, "$1⋟$2")
      .replace(/^(⋯?⋞.+[^⋟])(\n(⋑|⋞))/gm, "$1⋟$2")
      .replace(/^(⋯?⋞.+[^⋟])(\n⋯(⋑|⋞))/gm, "$1⋟$2")
      .replace(/^(⋯?⋞.+[^⋟])(\n(⋑|⋞))/gm, "$1⋟$2")
      .replace(/^(⋞.+)\n\n/gm, "$1⋟\n⋑\n\n")
      .replace(/⋯/g, "  ")
      .replace(/⋞/g, "<li>")
      .replace(/\n*⋟\n*/gm, "</li>")
      .replace(/\n*⋐\n*/gm, '<ul class="checklist">')
      .replace(/⋑\n?/gm, "</ul>")
      .replace(/\[ \]/g, "☐")
      .replace(/\[x\]/g, "☑")
      .replace(/(http[^ \n)]+)/g, '<a href="$1" target="_blank">$1</a>')
      .replace(/\n/g, "<br>")
  );
}

export default {
  name: "Todo",
  components: {
    "pa-edit-todo": EditTodo
  },
  props: {
    todo: {
      type: Object
    },
    transitionType: {
      type: String
    },
    categories: {
      type: Array
    },
    initCollapsed: {
      type: Boolean,
      default: true
    },
    isPlacedInGrid: {
      type: Boolean
    }
  },
  data() {
    return {
      isEditing: false,
      resetStyle: false,
      isCollapsed: !!this.initCollapsed && true,
      nrOfCharsWhenCollapsed: 15,
      maxTodoHeight: "100",
      transitionDuration: "1",
      isDeleteClicked: false,
      isTimerRunning: false,
      timerStartTime: null,
      timerStoredTime: this.todo.timeElapsed || 0,
      timerElapsedTime: null,
      week: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      month: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ]
    };
  },
  mounted() {
    this.setContentStyleProps();
  },
  computed: {
    ...mapGetters(["timeTick"]),
    tickTock() {
      return this.timeTick;
    },
    descriptionAsHtml() {
      return simpleFormat(this.todo.description);
    },
    noteAsHtml() {
      return simpleFormat(this.todo.note);
    },
    todoIsInProgress() {
      return this.todo.status === STATUS.PROGRESS;
    },
    todoIsComplete() {
      return this.todo.status === STATUS.COMPLETE;
    },
    showPin() {
      return !this.todoIsComplete && this.todo.isPinned;
    },
    due() {
      //let today = new Date();
      let date = this.dueDate;
      let dueTxt = "";
      if (date) {
        let dueInNrDays = calendarUtils.dayDiff(date, new Date());
        if (dueInNrDays <= DUETEXTWINDOWDAYS) {
          dueTxt =
            dueInNrDays === 0
              ? "today"
              : dueInNrDays === 1
              ? "tomorrow"
              : dueInNrDays === -1
              ? "yesterday"
              : dueInNrDays < -1
              ? -dueInNrDays + " days ago"
              : "in " + dueInNrDays + " days";
        } else {
          dueTxt =
            this.week[date.getDay()] +
            " " +
            this.month[date.getMonth()] +
            " " +
            date.getDate();
        }
      }

      return dueTxt;
    },
    dueDate() {
      return !this.todoIsComplete && this.todo._dateObj;
    },
    daysUntilDue() {
      return this.dueDate
        ? calendarUtils.dayDiff(this.dueDate, new Date())
        : null;
    },
    isNotYetDue() {
      return this.dueDate ? this.daysUntilDue > 0 : true;
    },
    isPastDue() {
      return this.dueDate ? this.daysUntilDue < 0 : false;
    },
    isDueToday() {
      return this.dueDate ? this.daysUntilDue === 0 : false;
    },
    isDueSoon() {
      return this.dueDate ? this.daysUntilDue <= DUEWARNINGWINDOWDAYS : false;
    },
    dueClass() {
      return (
        this.tickTock &&
        (this.isPastDue
          ? "pastdue"
          : this.isDueSoon
          ? "duesoon"
          : this.isDueToday
          ? "duetoday"
          : "notyetdue")
      );
    },
    timerButtonText() {
      return this.isTimerRunning? "stop timer": "start timer";
    },
    elapsedTime() {
      let nrMinutes = this.timerElapsedTime;
      let nrHours = Math.floor(nrMinutes / 60);
      nrMinutes = nrMinutes - nrHours*60;
      return this.isTimerRunning
        ? nrHours? nrHours + "h:" + nrMinutes + 'm' : nrMinutes + 'm'
        : "";
    },
    storedElapsedTime() {
      let nrMinutes = this.timerStoredTime;
      let nrHours = Math.floor(nrMinutes / 60);
      nrMinutes = nrMinutes - nrHours*60;
      return this.timerStoredTime? "(" + (nrHours? nrHours + "h:" + nrMinutes + 'm' : nrMinutes + 'm') + ")" : "";
    }
  },
  methods: {
    editTransitionComplete() {
      if (this.resetStyle) {
        this.setContentStyleProps();
        this.resetStyle = false;
      }
    },
    setContentStyleProps() {
      this.$nextTick(function() {
        let elHeight = this.$refs.content ? this.$refs.content.offsetHeight : 100;
        // set max-height to actual height
        // (to allow for non-delay smooth open/close transition)
        this.maxTodoHeight = elHeight;
        // calculate transition duration such that the transition speed
        // is fairly consistent for various todo heights. (in seconds)
        this.transitionDuration = 0.3 + elHeight / 500;
      });
    },
    toggleCollapse(evt) {
      // Need to use $forceUpdate and $nextTick to ensure classes
      // are set properly in the DOM after a filter action
      this.$forceUpdate();
      this.$nextTick(function() {
        let elName = evt.target.localName;
        let sel = window.getSelection && window.getSelection().toString();
        let cell = this.$el;
        // collapse, unless user clicked a link, a button or made a selection
        if (elName !== "a" && elName !== "button" && !sel) {
          this.isCollapsed = !this.isCollapsed;
          if (this.isCollapsed) {
            cell.classList.remove("expanded");
          } else {
            cell.classList.add("expanded");
          }
          // Recalculate the content height after the animation ends.
          // Mostly relevant in grid-view since the todo width there
          // increases from a column width to 100% when expanded. Thus the
          // height decreases.
          setTimeout(this.setContentStyleProps, 1000 * this.transitionDuration);
        }
        if (sel) {
          // write selection automically to clipboard if possible
          navigator.clipboard && navigator.clipboard.writeText(sel);
        }
      });
    },
    toggleTimer(todo) {
      this.isTimerRunning = !this.isTimerRunning;
      if (this.isTimerRunning) {
        this.timerElapsedTime = this.timerElapsedTime || 0;
        this.timerStartTime = new Date().getTime();
      } else {
        this.updateTimeElapsed();
      }
    },
    updateTimeElapsed() {
      this.timerElapsedTime = Math.round((new Date().getTime() - this.timerStartTime) / 1000 / 60) ;
      if (!this.isTimerRunning && this.timerElapsedTime > 0) {
        this.storeTimeElapsed();
        this.timerStoredTime = this.timerElapsedTime + this.timerStoredTime;
        this.timerElapsedTime = null;
      }
    },
    storeTimeElapsed() {
      let todoMod = this.todo;
      todoMod.timeElapsed = this.timerElapsedTime + this.timerStoredTime;
      this.editTodo(todoMod);
    },
    transitionTodo(todo) {
      if (this.isTimerRunning) {
        this.toggleTimer(todo);
      }
      this.$emit("transition-todo", todo);
    },
    deleteTodo(todo, isConfirmed) {
      if (typeof isConfirmed === "undefined") {
        // ask for confirmation
        this.isDeleteClicked = true;
      } else {
        this.isDeleteClicked = false;
        if (isConfirmed) {
          this.$emit("delete-todo", todo);
        }
      }
    },
    showForm() {
      this.isEditing = true;
      this.origTodo = Object.assign({}, this.todo);
    },
    editTodo(mod) {
      this.isEditing = false;
      this.$emit("edit-todo", { todo: this.todo, mod: mod });
      this.resetStyle = true;
    },
    cancelEdit() {
      this.todo.text = this.origTodo.text;
      this.todo.category = this.origTodo.category;
      this.isEditing = false;
    },
    editTodoWarning(warning) {
      this.$emit("edit-todo-warning", warning);
    }
  },
  watch: {
    timeTick() {
      if (this.isTimerRunning) {
        this.updateTimeElapsed();
        // every 5 minutes, store/backup the elapsed time
        if (this.timerElapsedTime > 0 && this.timerElapsedTime % 5 === 0) {
          this.storeTimeElapsed();
        }
      }
    }
  },
};
</script>

<style scoped>
.todo {
  padding: 5px;
}
.grid .todo {
  min-height: 15rem;
}
.content-text {
  padding: 0 5px;
  border-left: 3px solid #000;
  border-right: 3px solid #000;
}
.grid .content-text {
  border-right: 0;
}
.content-text.clr-red {
  border-color: #f91414;
}
.content-text.clr-blue {
  border-color: #2b2bff;
}
.content-text.clr-green {
  border-color: #14f926;
}
.content-text.clr-yellow {
  border-color: #ffea02;
}
.content-text.clr-purple {
  border-color: #c114f9;
}
.duesoon.due,
.pastdue.due {
  color: #ff0000;
}
.todo hr {
  border-style: groove;
}
.due,
.category,
.elapsed {
  float: right;
  font-style: italic;
  color: #cec0a1;
  font-size: 90%;
  padding: 0 10px;
}
.demph {
  color: #cec0a1;
}
.todo-description,
.todo-note {
  margin-top: 1em;
  padding-top: 0.5em;
  border-top: 1px dashed #383247;
  font-size: 95%;
  color: #cbd6c7c9;
}
.todo-note {
  font-style: italic;
  font-size: 90%;
  color: #cbd6c790;
}
.trans {
  /* use max-height to transition the height */
  /* the duration is calculated and set as inline style */
  transition: max-height 1s ease-out;
  /* set fall-back max-height here*/
  /* accurate max-height is set as inline style on the element */
  max-height: 50em;
  overflow: hidden;
}
.collapsed {
  /* must use !important to override inline style */
  max-height: 1.1em !important;
}
.show-overflow {
  overflow: auto;
}
.action-row {
  margin-top: 0.5em;
}
.confirm {
  margin-left: 1em;
  display: inline-block;
}
.action.button.full-width {
  width: 100%;
  margin: 0 0 5px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
  opacity: 1;
  transform: scaleY(1);
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0);
}
</style>
