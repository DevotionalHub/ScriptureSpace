import { supabase } from "./lib/supabase";

const form = document.querySelector("#auth-form");
const emailInput = document.querySelector("#email");
const status = document.querySelector("#auth-status");
const submitButton = document.querySelector("#auth-submit");
const mode = document.body.dataset.mode || "login";

const verificationUrl = new URL(
  "/verification.html",
  window.location.origin
).toString();

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (mode !== "signup") {
    window.location.assign("/#/home");
    return;
  }

  const email = emailInput?.value.trim().toLowerCase();

  if (!email) {
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Preparing your secure link…";

  status.textContent = "";
  status.className = "status";

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: verificationUrl,
      },
    });

    if (error) {
      throw error;
    }

    window.location.assign(verificationUrl);
  } catch (error) {
    submitButton.disabled = false;
    submitButton.textContent = "Create my account";

    status.textContent =
      error?.message || "Something went wrong. Please try again.";

    status.className = "status error";

    console.error("Signup request failed:", error);
  }
});
