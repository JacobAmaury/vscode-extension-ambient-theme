import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const cfg = () => vscode.workspace.getConfiguration('ambientTheme');

  const setThemeByTime = () => {
    const hour = new Date().getHours();
    const lightTheme = cfg().get<string>('lightTheme', 'Default Light+');
    const darkTheme  = cfg().get<string>('darkTheme',  'Default Dark+');
    const dayStart   = cfg().get<number>('dayStartHour', 13	);
    const nightStart = cfg().get<number>('nightStartHour', 20);

    let target = darkTheme;
    if (hour >= dayStart && hour < nightStart) {
      target = lightTheme;
    }

    vscode.workspace
      .getConfiguration('workbench')
      .update('colorTheme', target, vscode.ConfigurationTarget.Global);

    vscode.window.setStatusBarMessage(`AmbientTheme (heure=${hour}h) → ${target}`, 3000);
  };

  // Vérification immédiate au démarrage
  setThemeByTime();

  // Vérification automatique toutes les 15 minutes
  const timer = setInterval(setThemeByTime, 15 * 60 * 1000);

  context.subscriptions.push({ dispose: () => clearInterval(timer) });
}

export function deactivate() {}
