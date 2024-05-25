class Commands {
  static commands: any[] = [];
}

export default {
  get() {
    return Commands.commands;
  },
  add(command: any) {
    Commands.commands.push(command);
  }
}