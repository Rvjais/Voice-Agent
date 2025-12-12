import React from 'react';
import './ProjectsTable.css';

const ProjectsTable = () => {
    const projects = [
        {
            company: 'Chakra UI Version',
            members: ['👤', '👤', '👤', '👤'],
            budget: '$14,000',
            completion: 60,
        },
        {
            company: 'Add Progress Track',
            members: ['👤', '👤'],
            budget: '$3,000',
            completion: 10,
        },
        {
            company: 'Fix Platform Errors',
            members: ['👤', '👤', '👤'],
            budget: 'Not set',
            completion: 100,
        },
        {
            company: 'Launch our Mobile App',
            members: ['👤', '👤', '👤', '👤', '👤'],
            budget: '$32,000',
            completion: 100,
        },
        {
            company: 'Add the New Pricing Page',
            members: ['👤', '👤', '👤', '👤'],
            budget: '$400',
            completion: 25,
        },
    ];

    return (
        <div className="projects-table glass-card fade-in">
            <div className="table-header">
                <h3 className="table-title">Recent Voices</h3>

            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>COMPANY</th>
                            <th>MEMBERS</th>
                            <th>BUDGET</th>
                            <th>COMPLETION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="company-cell">
                                        <div className="company-logo">{project.company.charAt(0)}</div>
                                        <span>{project.company}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="members-cell">
                                        {project.members.map((member, i) => (
                                            <div key={i} className="member-avatar">{member}</div>
                                        ))}
                                    </div>
                                </td>
                                <td>
                                    <span className="budget-cell">{project.budget}</span>
                                </td>
                                <td>
                                    <div className="completion-cell">
                                        <span className="completion-text">{project.completion}%</span>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width: `${project.completion}%`,
                                                    background: project.completion === 100 ? 'var(--accent-green)' : 'var(--accent-blue)'
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectsTable;
