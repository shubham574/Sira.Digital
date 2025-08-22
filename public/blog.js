let currentPage = 1;
let pageSize = 5;
let allBlogs = [];
let currentTag = null;

async function loadBlogs() {
  const res = await fetch("http://localhost:3000/api/blogs");
  const blogs = await res.json();
  if (!Array.isArray(blogs)) return;
  allBlogs = blogs;
  renderTags();
  renderBlogs();
}

function renderTags() {
  const tagSet = new Set();
  allBlogs.forEach(b => b.tags?.forEach(t => tagSet.add(t)));
  const container = document.getElementById("tag-filter");
  container.innerHTML = [...tagSet].map(tag => `<span class="tag${tag === currentTag ? ' active' : ''}" onclick="filterByTag('${tag}')">${tag}</span>`).join("");
}

function filterByTag(tag) {
  currentTag = currentTag === tag ? null : tag;
  currentPage = 1;
  renderTags();
  renderBlogs();
}

function renderBlogs() {
  const container = document.getElementById("blog-list");
  container.innerHTML = "";
  const blogsToShow = allBlogs.filter(b => !currentTag || b.tags?.includes(currentTag));
  const paginated = blogsToShow.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  paginated.forEach(blog => {
    const div = document.createElement("div");
    div.className = "blog-post";
    div.innerHTML = `
      <div class="date">${new Date(blog.date).toLocaleDateString()}</div>
      <a class="title" href="${blog.url}" target="_blank">${blog.title}</a>
      <p class="description">${blog.notes}</p>
    `;
    container.appendChild(div);
  });
  document.getElementById("page-num").textContent = currentPage;
}

document.getElementById("prev-page").onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    renderBlogs();
  }
};
document.getElementById("next-page").onclick = () => {
  const blogsToShow = allBlogs.filter(b => !currentTag || b.tags?.includes(currentTag));
  if (currentPage * pageSize < blogsToShow.length) {
    currentPage++;
    renderBlogs();
  }
};

document.getElementById("theme-toggle").onclick = () => {
  document.body.classList.toggle("dark");
};

loadBlogs();