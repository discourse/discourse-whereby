import { withPluginApi } from "discourse/lib/plugin-api";
import showModal from "discourse/lib/show-modal";
import { iconHTML } from "discourse-common/lib/icon-library";

function launchWhereby($elem, user) {
  const iframeSource = settings.whereby_iframe_source;
  var subdomain = $elem.data("subdomain") || "";

  if (subdomain != "" && !subdomain.endsWith('.')) {
    subdomain = subdomain.concat('.');
  }

  const roomName = $elem.data("room");
  const displayName = user ? `&displayName=${user.username}` : "";

  $elem.children().hide();
  $elem.append(`
    <iframe 
      src="https://${subdomain}whereby.com/${roomName}?iframeSource=${iframeSource}${displayName}" 
      allow="camera;microphone;fullscreen;speaker" 
      width="690" height="500">
    </iframe> 
  `);

}

function attachButton($elem, user) {
  const buttonLabel =
    $elem.data("label") || I18n.t(themePrefix("launch_whereby"));

  $elem.html(
    `
      <div class="placeholder">
        <span class="icon">
          ${iconHTML(settings.button_icon)}
        </span>
        <span class="description">
          ${buttonLabel}
        </span>
      </div>
    `
  );
  $elem.on("click", () => launchWhereby($elem, user));
}

function attachWhereby($elem, helper) {
  if (helper) {
    const currentUser = helper.widget.currentUser;
    $elem.find("[data-wrap=discourse-whereby]").each((idx, val) => {
      attachButton($(val), currentUser);
    });
  }
}

export default {
  name: "insert-whereby",

  initialize() {
    withPluginApi("0.8.31", api => {
      let currentUser = api.getCurrentUser();
      api.onToolbarCreate(toolbar => {
        if (settings.only_available_to_staff && !currentUser.staff) {
          return;
        }

        toolbar.addButton({
          title: themePrefix("composer_title"),
          id: "insertWhereby",
          group: "insertions",
          icon: settings.button_icon,
          perform: e =>
            showModal("insert-whereby").setProperties({ toolbarEvent: e })
        });
      });

      api.decorateCooked(attachWhereby, { id: "discourse-whereby" });
    });
  }
};
