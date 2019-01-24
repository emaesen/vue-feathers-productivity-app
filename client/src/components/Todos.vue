<template>
  <section id="todos">
    <h2 class="todos">
      <font-awesome-icon icon="clipboard-list"/>Todos
    </h2>
    <div v-if="resultsFound" class="controls convert-to-block-on-small-device">
      <button @click="toggleOpenTasks" class="action button">Open
        <font-awesome-icon :icon="showOpenTasks? 'eye' : 'eye-slash'" class="flush-right"/>
      </button>
      <button @click="toggleProgressTasks" class="action button">Progress
        <font-awesome-icon :icon="showProgressTasks? 'eye' : 'eye-slash'" class="flush-right"/>
      </button>
      <button @click="toggleCompletedTasks" class="action button">Completed
        <font-awesome-icon :icon="showCompletedTasks? 'eye' : 'eye-slash'" class="flush-right"/>
      </button>
      <pa-clock v-if="!onDashboard"/>
    </div>
    <div>
      <pa-create-todo @create-todo="createTodo" :categories="categories"/>
      <div v-if="loading" class="loading">loading...</div>
      <div v-if="!resultsFound" class="noresults">No todos found...</div>

      <div class="columns" v-if="resultsFound">
        <div class="column" :class="'one-of-'+ nrOfColumns" v-if="showOpenTasks">
          <h4 class="todos-list-header">
            Open tasks
            <span class="tally">({{ openTodos.length }})</span>
          </h4>
          <transition-group tag="div" name="todos-list" class="todos-list">
            <pa-todo
              v-for="todo in openTodos"
              :todo="todo"
              :key="todo._id"
              :categories="categories"
              @delete-todo="deleteTodo"
              @edit-todo="editTodo"
              @transition-todo="transitionTodo"
              transitionType="start"
            />
          </transition-group>
        </div>

        <div class="column" :class="'one-of-'+ nrOfColumns" v-if="showProgressTasks">
          <h4 class="todos-list-header">
            Tasks In Progress
            <span class="tally">({{ inProgressTodos.length }})</span>
          </h4>
          <transition-group tag="div" name="todos-list" class="todos-list">
            <pa-todo
              v-for="todo in inProgressTodos"
              :todo="todo"
              :key="todo._id"
              :categories="categories"
              @delete-todo="deleteTodo"
              @edit-todo="editTodo"
              @transition-todo="transitionTodo"
              transition-type="complete"
            />
          </transition-group>
        </div>

        <div class="column" :class="'one-of-'+ nrOfColumns" v-if="showCompletedTasks">
          <h4 class="todos-list-header">
            Completed tasks
            <span class="tally">({{ completedTodos.length }})</span>
          </h4>
          <transition-group tag="div" name="todos-list" class="todos-list">
            <pa-todo
              v-for="todo in completedTodos"
              :todo="todo"
              :key="todo._id"
              :categories="categories"
              @delete-todo="deleteTodo"
              @edit-todo="editTodo"
            />
          </transition-group>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import calendarUtils from "../utils/calendar";
import Todo from "./Todo";
import CreateTodo from "./CreateEditTodo";
import Clock from "./Clock";

// Get todos as "Reactive Lists with Live Queries"
// https://feathers-plus.github.io/v1/feathers-vuex/common-patterns.html
import { mapState, mapGetters, mapActions } from "vuex";

const STATUS = {
  OPEN: "open",
  PROGRESS: "progress",
  COMPLETE: "complete"
};

export default {
  name: "Todos",
  components: {
    "pa-todo": Todo,
    "pa-create-todo": CreateTodo,
    "pa-clock": Clock
  },
  props: {
    onDashboard: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      displayOnlyOne: false,
      categories: [],
      showOpenTasks: true,
      showProgressTasks: true,
      showCompletedTasks: true
    };
  },
  created() {
    // Find all todos from server. We'll filter/sort on the client.
    this.loadTodos();
    if (this.onDashboard) {
      this.showCompletedTasks = false;
    }
  },
  methods: {
    ...mapActions("todos", { findTodos: "find" }),
    handleError(e) {
      console.error("Todos Error: ", e);
      if (e.name === "NotAuthenticated") {
        this.$router.push("/login");
      }
    },
    loadTodos() {
      // Find all todos from server. We'll filter/sort on the client.
      this.findTodos({ query: {} })
        .then(resp => {
          console.log({ findTodosResp: resp });
          this.setCategories();
        })
        .catch(err => {
          this.handleError(err);
        });
    },
    createTodo(newTodo) {
      newTodo.status = STATUS.OPEN;
      console.log("Create todo ", newTodo);
      // create todo instance
      const { Todo } = this.$FeathersVuex;
      const todo = new Todo(newTodo);
      todo
        .save()
        .then(todo => {
          console.log("Todo created ", todo);
          this.setCategories();
        })
        .catch(e => {
          this.handleError(e);
        });
    },
    deleteTodo(todo) {
      console.log("Delete todo ", todo);
      // delete the todo
      todo
        .remove()
        .then(() => {
          console.log("remove succesful");
          this.setCategories();
        })
        .catch(e => {
          this.handleError(e);
        });
    },
    editTodo(props) {
      console.log("Edit todo ", props);
      // save the modifictions
      props.todo.title = props.mod.title;
      props.todo.description = props.mod.description;
      props.todo.note = props.mod.note;
      props.todo.due = props.mod.due;
      props.todo.status = props.mod.status;
      props.todo.category = props.mod.category;
      props.todo.color = props.mod.color;
      props.todo.isPinned = props.mod.isPinned;
      props.todo
        .update()
        .then(todo => {
          console.log("edit succesful", todo);
          this.setCategories();
        })
        .catch(e => {
          this.handleError(e);
        });
    },
    transitionTodo(todo) {
      // transition STATUS.OPEN -> STATUS.PROGRESS -> STATUS.COMPLETE
      console.log("Transition todo ", todo);
      switch (todo.status) {
        case STATUS.OPEN:
          todo.status = STATUS.PROGRESS;
          break;
        case STATUS.PROGRESS:
          todo.status = STATUS.COMPLETE;
          break;
      }
      todo
        .update()
        .then(todo => {
          console.log("transition edit succesful", todo);
        })
        .catch(e => {
          this.handleError(e);
        });
    },
    dateObj(dateStr) {
      // convert yyyy-MM-dd string to date object
      return dateStr ? new Date(dateStr + "T00:00:00") : null;
    },
    sortByDateDue(a, b) {
      return !a.due
        ? 1
        : !b.due
        ? -1
        : this.dateObj(a.due) - this.dateObj(b.due);
    },
    sortByDateCreated(a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    },
    isPastDue(d1) {
      // d1 must be a date object
      return calendarUtils.timeDiff(d1, new Date()) < 0;
    },
    uiFilter(todo) {
      return todo ? true : false;
    },
    uiPreviewFilter(todo) {
      return todo ? true : false;
    },
    setCategories() {
      // get list of user-defined categories and remove duplicates
      this.categories = this.todosUnfiltered
        .map(n => n.category)
        .filter((c, i, s) => s.indexOf(c) === i)
        .sort();
      //console.log({ categories: this.categories });
    },
    toggleOpenTasks() {
      this.showOpenTasks = !this.showOpenTasks;
    },
    toggleProgressTasks() {
      this.showProgressTasks = !this.showProgressTasks;
    },
    toggleCompletedTasks() {
      this.showCompletedTasks = !this.showCompletedTasks;
    }
  },
  computed: {
    ...mapState("auth", { user: "payload" }),
    ...mapState("todos", {
      loading: "isFindPending",
      creating: "isCreatePending"
    }),
    ...mapGetters("todos", { findTodosInStore: "find" }),
    ...mapGetters({ calendarState: "calendar" }),
    resultsFound() {
      return !this.loading && this.todos && this.todos[0];
    },
    today() {
      return this.calendarState.today;
    },
    category() {
      // For large datasets, an option is to implement a query-selector.
      // But for the Todos service, we can just filter on the client.
      return null;
    },
    query() {
      // it is not necessary to define ownerId in the query:
      // The 'before' hooks in todos.hooks.js guarantee that only
      // the current user's todos are returned.
      // In combination with todos service clearAll on logout
      let query = {};

      return query;
    },
    openTodos() {
      // order by due date (earliest due on top)
      return this.todos
        .filter(todo => todo.status === STATUS.OPEN)
        .sort((a, b) => this.sortByDateCreated(a, b))
        .sort((a, b) => this.sortByDateDue(a, b));
    },
    inProgressTodos() {
      // order by due date (earliest due on top)
      return this.todos
        .filter(todo => todo.status === STATUS.PROGRESS)
        .sort((a, b) => this.sortByDateCreated(a, b))
        .sort((a, b) => this.sortByDateDue(a, b));
    },
    completedTodos() {
      // order by date completed (latest on top)
      return this.todos
        .filter(todo => todo.status === STATUS.COMPLETE)
        .sort((a, b) => b.dateCompleted - a.dateCompleted);
    },
    nrOfColumns() {
      let nr = 0;
      if (this.showOpenTasks) nr += 1;
      if (this.showProgressTasks) nr += 1;
      if (this.showCompletedTasks) nr += 1;
      return nr;
    },
    todos() {
      if (this.todosUnfiltered && this.todosUnfiltered.length > 0) {
        return this.todosUnfiltered.filter(this.uiFilter);
      } else {
        return [];
      }
    },
    todosUnfiltered() {
      return this.user
        ? this.findTodosInStore({
            query: this.query
          }).data.map(td => {
            if (td.due) {
              td._dateObj = new Date(td.due + "T00:00:00");
            }
            return td;
          })
        : [];
    }
  },
  watch: {
    today: "loadTodos"
  }
};
</script>

<style>
h2.todos {
  display: inline-block;
  margin-right: 1em;
  vertical-align: top;
}
#todos .controls {
  cursor: pointer;
  display: inline-block;
  position: relative;
  top: -5px;
}
.columns {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: stretch;
  margin: 0 -0.7em;
}
.column {
  display: inline-block;
}
.column + .column {
  border-left: 1px solid #3b3636;
  margin-left: -1px;
}
.column.one-of-3 {
  width: 33.333%;
}
.column.one-of-2 {
  width: 50%;
}
.column.one-of-1 {
  width: 100%;
}
.column.expanded {
  width: 100%;
}
h4.todos-list-header {
  text-align: center;
}
h4.todos-list-header {
  margin: 0.7em;
}
.tally {
  color: #e9e4f272;
  letter-spacing: normal;
  font-size: 90%;
  font-weight: normal;
}
.todos-list {
  margin: 0 0.7em;
}
.todos-list-cell:nth-child(odd) {
  background-color: #1e1d21;
}
.todos-list-cell + .todos-list-cell {
  border-top: 1px dashed #454545;
}
.todos-list-cell.pastdue,
.todos-list-cell.duesoon {
  margin: 2px;
  background: #560000;
  border: 1px solid #f00;
}
.todos-list-cell.duesoon {
  background: #6d2400;
}
.todos-list-cell.pastdue .todo,
.todos-list-cell.duesoon .todo {
  margin-bottom: 0;
}

.todos-list-cell {
  transition: all 1s;
}
.todos-list-enter,
.todos-list-leave-to {
  opacity: 0;
  transform: translate(0, -100px);
}
.todos-list-leave-active {
  position: absolute;
}
</style>
