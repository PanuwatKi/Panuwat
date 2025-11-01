// โหลดโพสต์จาก localStorage
let posts = JSON.parse(localStorage.getItem("posts")) || [];

// โหลดโพสต์ใน blog.html
function loadBlogPosts() {
  const container = document.getElementById("blog-container");
  if (!container) return;

  container.innerHTML = "";
  posts.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("post");
    div.innerHTML = `<h3>${p.title}</h3><p>${p.content}</p>`;
    if (p.image) div.innerHTML += `<img src="${p.image}" alt="Post Image">`;
    container.appendChild(div);
  });
}

// ฟังก์ชัน Login Admin
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const status = document.getElementById("login-status");

  if (user === "Panuwat" && pass === "panuwat") {
    localStorage.setItem("isAdmin", "true"); // จำสถานะ login
    window.location.href = "admin.html";
  } else {
    status.textContent = "❌ Invalid username or password !";
    //status.textContent = "Please Don't Hack Me Sir.\n";
  }
}

// ตรวจสอบสถานะ Admin
if (window.location.pathname.endsWith("admin.html")) {
  const isAdmin = localStorage.getItem("isAdmin");
  if (!isAdmin) window.location.href = "login.html";
  else loadAdminPosts();
}

// โหลดโพสต์ใน admin.html
function loadAdminPosts() {
  const container = document.getElementById("admin-posts");
  if (!container) return;
  container.innerHTML = "";
  posts.forEach((p, i) => {
    const div = document.createElement("div");
    div.classList.add("post");
    div.innerHTML = `
      <h3 contenteditable="true" onblur="editTitle(${i}, this.innerText)">${p.title}</h3>
      <p contenteditable="true" onblur="editContent(${i}, this.innerText)">${p.content}</p>
      ${p.image ? `<img src="${p.image}" alt="Post Image">` : ""}
      <button onclick="deletePost(${i})">Delete</button>
    `;
    container.appendChild(div);
  });
}

// Preview elements
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const imageInput = document.getElementById("imageFile");
const previewTitle = document.getElementById("preview-title");
const previewContent = document.getElementById("preview-content");
const previewImage = document.getElementById("preview-image");

if(titleInput) titleInput.addEventListener("input", ()=>{ previewTitle.textContent = titleInput.value || "Post Title Preview"; });
if(contentInput) contentInput.addEventListener("input", ()=>{ previewContent.textContent = contentInput.value || "Post content preview..."; });
if(imageInput) imageInput.addEventListener("change", ()=>{
  const file = imageInput.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = function(e){
      previewImage.src = e.target.result;
      previewImage.style.display = "block";
    }
    reader.readAsDataURL(file);
  } else {
    previewImage.src = "";
    previewImage.style.display = "none";
  }
});

// เพิ่มโพสต์พร้อมรูปภาพ
function addPost(){
  if(!titleInput || !contentInput) return;
  const title = titleInput.value;
  const content = contentInput.value;
  const file = imageInput.files[0];

  if(!title || !content) return alert("Please fill all fields!");

  if(file){
    const reader = new FileReader();
    reader.onload = function(e){
      posts.push({title, content, image: e.target.result});
      localStorage.setItem("posts", JSON.stringify(posts));
      loadAdminPosts();
      resetForm();
    }
    reader.readAsDataURL(file);
  } else {
    posts.push({title, content, image: ""});
    localStorage.setItem("posts", JSON.stringify(posts));
    loadAdminPosts();
    resetForm();
  }
}

// ล้างฟอร์มหลังโพสต์
function resetForm(){
  titleInput.value = "";
  contentInput.value = "";
  if(imageInput) imageInput.value = "";
  previewTitle.textContent = "Post Title Preview";
  previewContent.textContent = "Post content preview...";
  previewImage.src = "";
  previewImage.style.display = "none";
}

// แก้ไข / ลบโพสต์
function editTitle(i,text){ posts[i].title = text; localStorage.setItem("posts", JSON.stringify(posts)); }
function editContent(i,text){ posts[i].content = text; localStorage.setItem("posts", JSON.stringify(posts)); }
function deletePost(i){ posts.splice(i,1); localStorage.setItem("posts", JSON.stringify(posts)); loadAdminPosts(); }

// โหลดโพสต์ blog หน้าแรก
loadBlogPosts();
