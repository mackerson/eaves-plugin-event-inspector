# Event Inspector Plugin

**Version**: 1.0.0
**ID**: `com.eaves.event-inspector`

## Description

Real-time event monitoring and debugging tool for Eaves development. Monitor system events, AI interactions, plugin events, and custom events in real-time.

## Features

- Real-time event stream with auto-scroll
- Filter by category: System, AI, Plugin, Custom
- Search events by type, source, or data
- Export events to JSON
- Clear event history
- Detailed event data inspection

## Usage

This plugin is bundled with Eaves for development purposes. Access the Event Inspector by clicking the 🔍 Events icon in the sidebar.

## Event Categories

- **System**: `agent:*`, `project:*`, `channel:*`, `message:*`, `task:*`, `note:*`, `app:*`
- **AI**: `chat:*`, `tool:*`
- **Plugin**: `plugin:*`
- **Custom**: All other event types

## API Usage

This plugin demonstrates:
- `context.ui.registerView()` - Register custom views
- `context.ui.registerCommand()` - Register commands
- `context.utils.log.info()` - Logging

## Files

- `plugin.json` - Plugin manifest
- `index.cjs` - Plugin entry point
- `README.md` - This file

## Component

Uses `EventInspectorComponent` from `ui/src/EventInspectorComponent.tsx`

## Development

The Event Inspector is particularly useful for:
- Debugging plugin interactions
- Understanding event flow
- Monitoring AI agent behavior
- Testing custom events
