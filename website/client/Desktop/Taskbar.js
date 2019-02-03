import React from 'react';

import './Taskbar.css';

export const Taskbar = () => 
{
	return(
            <div className="taskbar">
                <span className="taskbar-programs_bar">
                </span>
                <span className="taskbar-start">
                    <img src="assets/mk_logo.png" height="25" width="25" />
                </span>
                <span className="taskbar-time">
                    <span>1:40 PM</span>
                </span>
            </div>
	);
	
}
