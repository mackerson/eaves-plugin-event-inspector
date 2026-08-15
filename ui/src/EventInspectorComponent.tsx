import React, { useState, useEffect } from 'react';

// Access app dependencies from window.EavesAPI
const { Button, Input, Badge, AppIcon } = window.EavesAPI.UI;

interface CapturedEvent {
  id: string;
  type: string;
  category: 'system' | 'ai' | 'plugin' | 'custom';
  data?: any;
  source: string;
  timestamp: number;
}

type FilterCategory = 'all' | 'system' | 'ai' | 'plugin' | 'custom';

/**
 * Event Inspector Component
 * Real-time event monitoring and debugging
 */
export function EventInspectorComponent() {
  const [events, setEvents] = useState<CapturedEvent[]>([]);
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [search, setSearch] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);

  // Load initial events from EventBus history
  useEffect(() => {
    // Load event history from main process
    const loadEvents = async () => {
      try {
        const history = await (window as any).electron.getEventHistory();
        if (history && Array.isArray(history)) {
          // Only update if we have new events (compare timestamps and length)
          setEvents(prevEvents => {
            // If lengths differ or latest timestamp changed, update
            if (prevEvents.length !== history.length ||
                (history.length > 0 && prevEvents.length > 0 &&
                 prevEvents[prevEvents.length - 1]?.timestamp !== history[history.length - 1]?.timestamp)) {

              // Create stable IDs based on timestamp + type + index to avoid re-rendering existing events
              const formatted: CapturedEvent[] = history.map((event, index) => ({
                id: `event-${event.timestamp}-${event.type}-${index}`,
                type: event.type,
                category: categorizeEvent(event.type),
                data: event.data,
                source: event.source || 'unknown',
                timestamp: event.timestamp
              }));
              return formatted;
            }
            return prevEvents; // No changes, keep existing state
          });
        }
      } catch (error) {
        console.error('Failed to load event history:', error);
      }
    };

    loadEvents();

    // Poll for new events every second
    const interval = setInterval(loadEvents, 1000);

    return () => clearInterval(interval);
  }, []);

  const categorizeEvent = (eventType: string): 'system' | 'ai' | 'plugin' | 'custom' => {
    if (eventType.startsWith('agent:') || eventType.startsWith('project:') ||
        eventType.startsWith('channel:') || eventType.startsWith('message:') ||
        eventType.startsWith('task:') || eventType.startsWith('note:') ||
        eventType.startsWith('app:')) {
      return 'system';
    }

    if (eventType.startsWith('chat:') || eventType.startsWith('tool:')) {
      return 'ai';
    }

    if (eventType.startsWith('plugin:')) {
      return 'plugin';
    }

    return 'custom';
  };

  // Filter events
  const filteredEvents = events.filter(event => {
    // Filter by category
    if (filter !== 'all' && event.category !== filter) {
      return false;
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        event.type.toLowerCase().includes(searchLower) ||
        event.source.toLowerCase().includes(searchLower) ||
        JSON.stringify(event.data).toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Auto-scroll to bottom when new events arrive
  useEffect(() => {
    if (autoScroll) {
      const container = document.getElementById('event-list');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [filteredEvents, autoScroll]);

  const handleClear = async () => {
    // Clear both local state and EventBus history
    setEvents([]);
    try {
      await (window as any).electron.clearEventHistory();
    } catch (error) {
      console.error('Failed to clear event history:', error);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredEvents, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eaves-events-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'system': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'ai': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'plugin': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'custom': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Event Inspector</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              title="Clear all events"
            >
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              title="Export events to JSON"
            >
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({events.length})
          </Button>
          <Button
            variant={filter === 'system' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('system')}
          >
            System ({events.filter(e => e.category === 'system').length})
          </Button>
          <Button
            variant={filter === 'ai' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('ai')}
          >
            AI ({events.filter(e => e.category === 'ai').length})
          </Button>
          <Button
            variant={filter === 'plugin' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('plugin')}
          >
            Plugin ({events.filter(e => e.category === 'plugin').length})
          </Button>
          <Button
            variant={filter === 'custom' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('custom')}
          >
            Custom ({events.filter(e => e.category === 'custom').length})
          </Button>
        </div>

        {/* Search */}
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded"
            />
            Auto-scroll
          </label>
        </div>
      </div>

      {/* Event List */}
      <div
        id="event-list"
        className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm"
      >
        {filteredEvents.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <div className="mb-2 flex justify-center">
              <AppIcon name="search" size={48} />
            </div>
            <p>No events to display</p>
            <p className="text-xs mt-1">
              {search ? 'Try a different search term' : 'Events will appear here in real-time'}
            </p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="p-3 rounded-lg bg-card border border-border hover:bg-accent transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Timestamp */}
                <div className="text-muted-foreground text-xs whitespace-nowrap pt-0.5">
                  {formatTimestamp(event.timestamp)}
                </div>

                {/* Category Badge */}
                <Badge
                  variant="outline"
                  className={`${getCategoryColor(event.category)} text-xs`}
                >
                  {event.category}
                </Badge>

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-foreground">
                      {event.type}
                    </span>
                    {event.source !== 'core' && (
                      <span className="text-xs text-muted-foreground">
                        from {event.source}
                      </span>
                    )}
                  </div>

                  {/* Event Data */}
                  {event.data && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                        View data
                      </summary>
                      <pre className="mt-2 p-2 rounded bg-muted text-xs overflow-x-auto">
                        {JSON.stringify(event.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t border-border bg-card">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {filteredEvents.length} of {events.length} events
          </span>
          <span>
            Max buffer: 1000 events
          </span>
        </div>
      </div>
    </div>
  );
}
