<template>
  <section id="todos">
    <h2 class="todos">
      <font-awesome-icon icon="clipboard-list"/>Todos
    </h2>
    <div v-if="resultsFound" class="controls convert-to-block-on-small-device">
      <button @click="minimize=!minimize" class="action button">
        <font-awesome-icon
          :icon="minimize? 'align-justify' : ['far','window-minimize']"
          class="flush-right"
        />
      </button>
      <pa-clock v-if="!onDashboard"/>
    </div>
    <div>
      <pa-create-todo @create-todo="createTodo"/>
      <div v-if="loading" class="loading">loading...</div>
      <div v-if="!resultsFound" class="noresults">No todos found...</div>
      <div class="columns" v-if="resultsFound">
        <div class="column one-of-three">
          <h4 class="todos-list-header">
            Open tasks
            <span class="tally">({{ openTodos.length }})</span>
          </h4>
          <transition-group tag="div" name="todos-list" class="todos-list">
            <pa-todo
              v-for="todo in openTodos"
              :todo="todo"
              :key="todo._id"
              @delete-todo="deleteTodo"
              @edit-todo="editTodo"
              @transition-todo="transitionTodo"
              transitionType="start"
            />
          </transition-group>
        </div>

        <div class="column one-of-three">
          <h4 class="todos-list-header">
            Tasks In Progress
            <span class="tally">({{ inProgressTodos.length }})</span>
          </h4>
          <transition-group tag="div" name="todos-list" class="todos-list">
            <pa-todo
              v-for="todo in inProgressTodos"
              :todo="todo"
              :key="todo._id"
              @delete-todo="deleteTodo"
              @edit-todo="editTodo"
              @transition-todo="transitionTodo"
              transition-type="complete"
            />
          </transition-group>
        </div>

        <div class="column one-of-three">
          <h4 class="todos-list-header">
            Completed tasks
            <span class="tally">({{ completedTodos.length }})</span>
          </h4>
          <transition-group tag="div" name="todos-list" class="todos-list">
            <pa-todo
              v-for="todo in completedTodos"
              :todo="todo"
              :key="todo._id"
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
      minimize: this.onDashboard,
      displayOnlyOne: false
    };
  },
  created() {
    // Find all todos from server. We'll filter/sort on the client.
    this.loadTodos();
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
        .then(resp => console.log({ findTodosResp: resp }))
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
    todos() {
      if (this.todosUnfiltered && this.todosUnfiltered.length > 0) {
        let nextTodo = this.todosUnfiltered[0];
        if (this.minimize) {
          if (this.displayOnlyOne) {
            return [nextTodo];
          } else {
            let todosArray = this.todosUnfiltered.filter(this.uiPreviewFilter);
            return todosArray.length > 0 ? todosArray : [nextTodo];
          }
        } else {
          return this.todosUnfiltered.filter(this.uiFilter);
        }
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
.column.one-of-three {
  width: 33.333%;
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
