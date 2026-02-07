export interface SampleTemplate {
  name: string;
  description: string;
  content: string;
  icon?: string;
  iconColor?: string;
}

export const JSON_TO_CPP_SAMPLES: SampleTemplate[] = [
  {
    name: 'API Response',
    description: 'REST API response structure',
    icon: 'fa-cloud',
    content: JSON.stringify({
      success: true,
      data: {
        id: 12345,
        name: "Widget Pro",
        price: 29.99,
        available: true,
        tags: ["electronics", "gadgets"]
      },
      timestamp: "2024-01-15T10:30:00Z"
    }, null, 2),
  },
  {
    name: 'Config File',
    description: 'Application configuration',
    icon: 'fa-cog',
    content: JSON.stringify({
      app_name: "MyApp",
      version: "1.0.0",
      debug_mode: false,
      max_connections: 100,
      server: {
        host: "localhost",
        port: 8080,
        timeout_ms: 30000
      },
      features: ["logging", "caching", "compression"]
    }, null, 2),
  },
  {
    name: 'Game Entity',
    description: 'Game object with stats',
    icon: 'fa-gamepad',
    content: JSON.stringify({
      entity_id: 1001,
      name: "Dragon",
      type: "monster",
      health: 500,
      position: { x: 100.5, y: 50.0, z: 25.3 },
      stats: {
        strength: 85,
        defense: 70,
        speed: 45
      },
      abilities: ["fire_breath", "fly", "tail_swipe"]
    }, null, 2),
  },
  {
    name: 'Sensor Data',
    description: 'IoT sensor readings',
    icon: 'fa-microchip',
    content: JSON.stringify({
      device_id: "SENSOR_001",
      timestamp_ms: 1705312200000,
      readings: [
        { sensor_type: "temperature", value: 23.5, unit: "celsius" },
        { sensor_type: "humidity", value: 65.2, unit: "percent" },
        { sensor_type: "pressure", value: 1013.25, unit: "hpa" }
      ],
      battery_level: 85,
      status: "active"
    }, null, 2),
  },
  {
    name: 'Nested Objects',
    description: 'Complex nested structure',
    icon: 'fa-sitemap',
    content: JSON.stringify({
      company: {
        name: "Tech Corp",
        departments: [
          {
            name: "Engineering",
            employee_count: 50,
            budget: 5000000.00
          },
          {
            name: "Marketing",
            employee_count: 20,
            budget: 1500000.00
          }
        ]
      },
      fiscal_year: 2024,
      public: true
    }, null, 2),
  },
];
