"use client";

import { useEffect } from 'react';

export default function BringThemHomeWidget() {
  useEffect(() => {
    // Create and append the script after the component mounts
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://bringthemhomenow.net/1.3.0/hostages-ticker.js";
    script.setAttribute(
      "integrity",
      "sha384-MmP7bD5QEJWvJccg9c0lDnn3LjjqQWDiRCxRV+NU8hij15icuwb29Jfw1TqJwuSv"
    );
    script.setAttribute("crossorigin", "anonymous");
    document.getElementsByTagName("head")[0].appendChild(script);

    // Clean up function
    return () => {
      // Remove the script when component unmounts
      const scriptElement = document.querySelector('script[src="https://bringthemhomenow.net/1.3.0/hostages-ticker.js"]');
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div id="bthn" lang="he"></div>
    </div>
  );
} 