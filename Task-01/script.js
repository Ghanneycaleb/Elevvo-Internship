const appShell = document.querySelector("#appShell");
const sidebar = document.querySelector("#sidebar");
const sidebarToggle = document.querySelector("#sidebarToggle");
const mobileMenu = document.querySelector("#mobileMenu");
const backdrop = document.querySelector("#backdrop");
const mobileBreakpoint = window.matchMedia("(max-width: 768px)");

let isSidebarCollapsed = false;
let isMobileSidebarOpen = false;

function updateSidebarState() {
  const isMobile = mobileBreakpoint.matches;

  appShell.classList.toggle("is-collapsed", !isMobile && isSidebarCollapsed);
  sidebar.classList.toggle("is-mobile-open", isMobile && isMobileSidebarOpen);
  sidebar.setAttribute("aria-hidden", String(isMobile && !isMobileSidebarOpen));
  sidebar.inert = isMobile && !isMobileSidebarOpen;
  sidebarToggle.setAttribute(
    "aria-expanded",
    String(isMobile ? isMobileSidebarOpen : !isSidebarCollapsed),
  );
  sidebarToggle.setAttribute(
    "aria-label",
    isMobile
      ? isMobileSidebarOpen
        ? "Close sidebar"
        : "Open sidebar"
      : isSidebarCollapsed
        ? "Expand sidebar"
        : "Collapse sidebar",
  );
  mobileMenu.setAttribute("aria-expanded", String(isMobileSidebarOpen));
  mobileMenu.setAttribute(
    "aria-label",
    isMobileSidebarOpen ? "Close sidebar" : "Open sidebar",
  );
  backdrop.hidden = !isMobile || !isMobileSidebarOpen;
}

function closeMobileSidebar({ restoreFocus = false } = {}) {
  isMobileSidebarOpen = false;
  updateSidebarState();

  if (restoreFocus && mobileBreakpoint.matches) {
    mobileMenu.focus();
  }
}

sidebarToggle.addEventListener("click", () => {
  if (mobileBreakpoint.matches) {
    closeMobileSidebar({ restoreFocus: true });
    return;
  }

  isSidebarCollapsed = !isSidebarCollapsed;
  updateSidebarState();
});

mobileMenu.addEventListener("click", () => {
  isMobileSidebarOpen = !isMobileSidebarOpen;
  updateSidebarState();

  if (isMobileSidebarOpen) {
    sidebarToggle.focus();
  }
});

backdrop.addEventListener("click", () =>
  closeMobileSidebar({ restoreFocus: true }),
);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && isMobileSidebarOpen) {
    closeMobileSidebar({ restoreFocus: true });
  }
});

mobileBreakpoint.addEventListener("change", () => {
  if (mobileBreakpoint.matches && sidebar.contains(document.activeElement)) {
    mobileMenu.focus();
  } else if (
    !mobileBreakpoint.matches &&
    document.activeElement === mobileMenu
  ) {
    sidebarToggle.focus();
  }

  isMobileSidebarOpen = false;
  updateSidebarState();
});

updateSidebarState();
