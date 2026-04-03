/**
 * Event Inspector Plugin for Enclave
 * Real-time event monitoring and debugging
 */

module.exports = {
  activate(context) {
    context.utils.log.info('Event Inspector plugin activated');

    // Register the event inspector as a custom view
    context.ui.registerView({
      id: 'event-inspector',
      title: 'Events',
      icon: '🔍',
      component: 'EventInspectorComponent', // References renderer component
    });

    // Register command to clear event history
    context.ui.registerCommand({
      id: 'events.clear',
      title: 'Clear Event History',
      handler: async () => {
        context.utils.log.info('Clearing event history via command');
        // The actual clearing is handled by the component
        context.ui.showNotification({
          title: 'Event Inspector',
          message: 'Event history cleared',
        });
      },
    });

    context.utils.log.info('Event Inspector plugin registered successfully');
  },

  deactivate(context) {
    context.utils.log.info('Event Inspector plugin deactivated');
  },
};
