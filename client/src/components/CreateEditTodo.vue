<template>
  <div :class="[{form: showForm}, {border: showForm && !isEdit}]">
    <transition name="fade">
      <button
        v-if="!showForm && !isEdit"
        class="action button absolute top right spaced"
        @click="openTodoForm"
      >
        <font-awesome-icon icon="plus-circle"/>add todo
      </button>
    </transition>
    <transition name="slidefade">
      <div v-if="showForm" @keydown.s="onKeydownS">
        <div class>
          <label for="title">
            Todo title
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
            placeholder="Todo title"
            required
          >
        </div>
        <div>
          <label for="description">Todo description</label>
          <textarea
            id="description"
            name="description"
            v-model="description"
            :class="'clr-' + color"
            :style="{height: descriptionAreaHeight + 'px'}"
            placeholder="Todo description"
          />
        </div>

        <div class>
          <label for="note">Note / Comment</label>
          <textarea
            id="note"
            name="note"
            v-model="note"
            :style="{height: noteAreaHeight + 'px'}"
            placeholder="Note / Comment"
          />
        </div>

        <div class>
          <label for="due">Date Due</label>
          <input
            id="due"
            name="due"
            v-model="due"
            type="date"
            placeholder="yyyy-mm-dd"
            min="new Date()"
          >
        </div>

        <div class="clr-selector">
          <span v-for="clr in colors" :key="clr" class="action button" @click="selectClr(clr)">
            <span class="clr check" :class="'clr-' + clr" :title="clr">{{ clr===color ? "✔" : "" }}</span>
          </span>
        </div>
        <div>
          <label for="category">Category</label>
          <input
            id="category"
            name="category"
            type="text"
            v-model="category"
            maxlength="15"
            placeholder="type new or select below"
          >
          <span
            class="action button dashboard"
            :class="{checked: isPinned}"
            @click="toggleIsPinned"
            :title="isPinned ? 'pinned on dashboard' : 'pin on dashboard'"
          >{{ isPinned ? "pinned" : "pin" }} on dashboard</span>
          <div class="categories">
            <span class="expl">└ select ➔</span>
            <div class="category" v-for="cat in categories" :key="cat">
              <button class="action cat" v-if="cat && cat.length>0" @click="category=cat">{{ cat }}</button>
            </div>
          </div>
        </div>
        <div>
          <button class="action button" @click="save" :disabled="!isValid">
            <font-awesome-icon icon="check-circle"/>save
          </button>
          <button class="action button" @click="cancel">
            <font-awesome-icon icon="ban"/>cancel
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "CreatEditTodo",
  props: {
    todo: {
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
      title: (this.todo && this.todo.title) || "",
      description: (this.todo && this.todo.description) || "",
      note: (this.todo && this.todo.note) || "",
      due: (this.todo && this.todo.due) || "",
      status: (this.todo && this.todo.status) || "",
      category: (this.todo && this.todo.category) || "",
      color: (this.todo && this.todo.color) || "",
      showForm: !!(this.todo && this.todo.title),
      isPinned: !!(this.todo && this.todo.isPinned),
      showError: false,
      colors: ["", "red", "blue", "green", "yellow", "purple"]
    };
  },
  computed: {
    isEdit() {
      return !!(this.todo && this.todo.title);
    },
    isValid() {
      return this.title;
    },
    descriptionAreaHeight() {
      const minHeight = 150;
      return this.contentHeight > minHeight ? this.contentHeight : minHeight;
    },
    noteAreaHeight() {
      const minHeight = 150;
      return this.contentHeight > minHeight ? this.contentHeight : minHeight;
    }
  },
  methods: {
    openTodoForm() {
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
      this.closeTodoForm();
    },
    closeTodoForm() {
      if (this.isEdit) {
        this.resetTodoForm();
      } else {
        this.clearTodoForm();
      }
    },
    resetTodoForm() {
      this.title = this.todo.title;
      this.description = this.todo.description;
      this.note = this.todo.note;
      this.due = this.todo.due;
      this.status = this.todo.status;
      this.category = this.todo.category;
      this.color = this.todo.color;
      this.isPinned = this.todo.isPinned;
    },
    clearTodoForm() {
      this.title = "";
      this.description = "";
      this.note = "";
      this.due = "";
      this.status = "";
      this.category = "";
      this.color = "";
      this.isPinned = false;
      this.showForm = false;
    },
    toggleIsPinned() {
      this.isPinned = !this.isPinned;
    },
    save() {
      const msgType = this.isEdit ? "edit-todo" : "create-todo";
      this.showError = false;
      if (this.title.length > 0) {
        this.$emit(msgType, {
          title: this.title,
          description: this.description,
          note: this.note,
          due: this.due,
          status: this.status,
          category: this.category,
          color: this.color,
          isPinned: this.isPinned
        });
        this.closeTodoForm();
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
input#title {
  width: 80%;
}
input#category {
  width: 8em;
}
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
button.action.cat {
  margin-left: 0.3em;
}
.button.dashboard {
  margin-left: 1em;
}
.button.dashboard.checked::before {
  content: "✓ ";
  color: #29dc58;
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
