// initial load
let tasks = [];
let inputName = "";
loadTasks();

new Vue({
  el: "#tasklist",
  data: {
    tasks,
  },
  methods: {
    newTask: function () {
      if (!inputName) {
        return;
      }
      updateTasks(inputName);
      inputName = "";
    },
    deleteTask: function (task) {
      removeTask(task.id);
      this.tasks.splice(this.tasks.indexOf(task), 1);
    },
  },
});

function loadTasks() {
  db.collection("todo-items").orderBy("date", "asc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        tasks.push(
          {name:doc.data().name, 
            id: doc.id,
          date: doc.data().date.toDate()}
          );
      });
    });
}

function updateTasks(inputName) {
  let currentTime = new Date();
  db.collection("todo-items").add({
    name: inputName,
    date: currentTime
  }).then((docRef) => {
    tasks.push({
      name: inputName,
      date: currentTime,
      id: docRef.id
    })
});
}

function removeTask(id){
  db.collection("todo-items").doc(id).delete().then(() => {
    console.log("Document successfully deleted!");
})
}
