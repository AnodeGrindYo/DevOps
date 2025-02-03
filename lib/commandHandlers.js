// lib/commandHandlers.js
export const commandHandlers = {
  ls: (command, fs) => {
    if (command.trim() === 'ls') {
      return {
        success: true,
        output: fs.ls().join('  ')
      };
    }
    return {
      success: false,
      output: "Commande non reconnue. Essayez 'ls'"
    };
  },

  mkdir: (command, fs) => {
    const args = command.trim().split(' ');
    if (args[0] === 'mkdir' && args[1]) {
      if (fs.mkdir(args[1])) {
        return {
          success: true,
          output: `Répertoire '${args[1]}' créé avec succès!`
        };
      }
    }
    return {
      success: false,
      output: "Ce n'est pas la bonne commande. Utilisez 'mkdir' suivi du nom du répertoire."
    };
  },

  cd: (command, fs) => {
    const args = command.trim().split(' ');
    if (args[0] === 'cd' && args[1]) {
      if (fs.cd(args[1])) {
        return {
          success: true,
          output: `Vous êtes maintenant dans ${fs.currentPath[0]}`
        };
      }
    }
    return {
      success: false,
      output: "Ce n'est pas la bonne commande pour se déplacer dans un répertoire."
    };
  }
};
