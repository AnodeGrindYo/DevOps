// lib/courseLoader.js
import { commandHandlers } from './commandHandlers';

export async function loadCourse(courseName) {
  try {

    const response = await fetch(`/courses/TerminalCourses/${courseName}.json`);
    const courseData = await response.json();

    return courseData.missions.map((mission) => ({
      title: mission.title,
      description: mission.description,
      hint: mission.hint,
      verify: (command, fs) => {
        // On essaie d’abord d’utiliser un handler spécial si disponible.
        // On utilise ici la première partie de la commande comme clé.
        const commandKey = mission.command.split(' ')[0];
        const handler = commandHandlers[commandKey];
        if (handler) {
          return handler(command, fs);
        }
        // Vérification par défaut
        if (command.trim() === mission.command) {
          return {
            success: true,
            output: mission.successOutput
          };
        }
        return {
          success: false,
          output: mission.errorOutput
        };
      }
    }));
  } catch (error) {
    console.error('Error loading course:', error);
    return [];
  }
}
