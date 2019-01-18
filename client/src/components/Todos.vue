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
    <div class>
      <pa-create-todo @create-todo="createTodo"/>
      <div v-if="loading" class="loading">loading...</div>
      <div v-if="!resultsFound" class="noresults">No todos found...</div>
      <transition-group v-if="resultsFound" tag="div" name="todos-list">
        <pa-todo
          v-for="todo in todos"
          :todo="todo"
          :key="todo._id"
          @delete-todo="deleteTodo"
          @edit-todo="editTodo"
        />
      </transition-group>
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
    sortByDate(a, b) {
      // a and b are todos
      if (a._dateObj && b._dateObj) {
        return calendarUtils.timeDiff(a._dateObj, b._dateObj);
      } else {
        // TODO!
        return 1;
      }
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
          })
            .data.map(td => {
              if (td.due) {
                td._dateObj = new Date(td.due + "T00:00:00");
              }
              return td;
            })
            .sort(this.sortByDate)
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
