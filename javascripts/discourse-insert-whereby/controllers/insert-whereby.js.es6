import Controller from "@ember/controller";
import ModalFunctionality from "discourse/mixins/modal-functionality";

export default Controller.extend(ModalFunctionality, {
  keyDown(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  },

  onShow() {
    this.setProperties({
      wherebyRoom: "",
      wherebySubdomain: settings.whereby_subdomain,
      buttonText: ""
    });
  },

  actions: {
    insert() {
      const btnTxt = this.buttonText ? ` label="${this.buttonText}"` : "";
      const subdomain = this.wherebySubdomain ? `${this.wherebySubdomain}` : "";
      let text = `[wrap=discourse-whereby room="${this.wherebyRoom}" subdomain="${subdomain}" ${btnTxt}]\n[/wrap]`;
      this.toolbarEvent.addText(text);
      this.send("closeModal");
    },
    cancel() {
      this.send("closeModal");
    }
  }
});
