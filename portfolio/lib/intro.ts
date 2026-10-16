// Chave usada para lembrar, durante a sessão, que a intro já passou
export const INTRO_STORAGE_KEY = "mg-intro-seen";

// Roda antes de a página aparecer. Se a intro já foi vista (ou se a pessoa
// pediu "reduzir movimento"), marca o <html> e o CSS esconde a intro logo de
// cara, sem piscar.
export const introScript = `try{var d=document.documentElement;if(sessionStorage.getItem("${INTRO_STORAGE_KEY}")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)d.setAttribute("data-intro-seen","")}catch(e){}`;
