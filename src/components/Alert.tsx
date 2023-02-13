import React from 'react';

const alert = (error: number) => {
  if (error === 403) return { icon: '⛔️', message: "You don't have permission to access this Spreadsheet." }
  if (error === 404) return { icon: '❓', message: "Spreadsheet not found." }
  return { icon: '💀', message: "Doh, I couldn’t load the data." }
}

const Alert: React.FC<{ error: { code: number } }> = ({ error }) => {
  const { icon, message } = alert(error.code);

  return (
    <p className="alert">
    <span className="alert__icon">{ icon }</span>
      { message }
    </p>
  )
}

export default Alert;
