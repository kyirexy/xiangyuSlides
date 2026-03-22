export default {
    project: process.env.TRIGGER_PROJECT_REF || undefined,
    runtime: 'node',
    dirs: ['./trigger']
};
