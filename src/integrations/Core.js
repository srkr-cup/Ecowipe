// This file mocks API calls and external integrations
// In a real application, this would contain fetch/axios calls to a backend API.

const mockDatabase = {
  users: [
    {
      id: "usr_1a2b3c4d",
      email: "user@example.com",
      full_name: "Jane Doe",
      role: "user",
      total_eco_points: 250,
      total_devices_wiped: 3,
      total_data_wiped_gb: 768,
      eco_badges: ["GREEN_SHIELD"]
    },
    {
      id: "usr_5e6f7g8h",
      email: "admin@example.com",
      full_name: "Admin User",
      role: "admin",
      total_eco_points: 9999,
      total_devices_wiped: 50,
      total_data_wiped_gb: 10000,
      eco_badges: ["GREEN_SHIELD", "DATA_GUARDIAN", "ECO_WARRIOR"]
    }
  ],
  wipeRecords: [
    {
      id: "rec123abcde",
      created_by: "Jane Doe",
      device_type: "laptop",
      operating_system: "windows",
      wipe_method: "military",
      wipe_command: "sdelete -p 7 -z C:",
      proof_screenshot_url: "https://via.placeholder.com/600x400.png?text=Wipe+Proof+Screenshot",
      status: "completed",
      eco_points: 100,
      device_size_gb: 512,
      created_date: "2025-09-20T10:00:00Z"
    },
    {
      id: "rec456fghij",
      created_by: "Jane Doe",
      device_type: "hdd",
      operating_system: "linux",
      wipe_method: "deep",
      wipe_command: "shred -vfz -n 3 /dev/sda",
      proof_screenshot_url: "https://via.placeholder.com/600x400.png?text=Wipe+Proof+Screenshot",
      status: "completed",
      eco_points: 75,
      device_size_gb: 1000,
      created_date: "2025-09-18T15:30:00Z"
    },
    {
      id: "rec789klmno",
      created_by: "Jane Doe",
      device_type: "mobile",
      operating_system: "android",
      wipe_method: "quick",
      wipe_command: "adb shell dd if=/dev/zero of=/dev/block/userdata",
      proof_screenshot_url: "https://via.placeholder.com/600x400.png?text=Wipe+Proof+Screenshot",
      status: "completed",
      eco_points: 50,
      device_size_gb: 128,
      created_date: "2025-09-15T09:12:00Z"
    },
    {
      id: "rec101pqrst",
      created_by: "Admin User",
      device_type: "ssd",
      operating_system: "windows",
      wipe_method: "military",
      wipe_command: "sdelete -p 7 -z C:",
      proof_screenshot_url: "https://via.placeholder.com/600x400.png?text=Wipe+Proof+Screenshot",
      status: "completed",
      eco_points: 100,
      device_size_gb: 256,
      created_date: "2025-09-21T18:45:00Z"
    },
    {
      id: "rec102uvwxy",
      created_by: "Jane Doe",
      device_type: "usb",
      operating_system: "windows",
      wipe_method: "deep",
      wipe_command: "sdelete -p 3 -z C:",
      proof_screenshot_url: null,
      status: "pending_proof",
      eco_points: 75,
      device_size_gb: 32,
      created_date: "2025-09-22T20:00:00Z"
    }
  ]
};

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export async function List(path) {
  await delay(500);
  if (path === '/api/users') {
    return mockDatabase.users;
  }
  if (path === '/api/wipe-records') {
    return mockDatabase.wipeRecords;
  }
  return [];
}

export async function Read(path) {
  await delay(500);
  // Handle both /api/resource/id and /api/resource formats
  const parts = path.split('/').filter(p => p);
  const resource = parts[1]; // 'api' is parts[0]
  const id = parts[2];

  if (resource === 'users') {
    return mockDatabase.users.find(item => item.id === id);
  }
  if (resource === 'wipe-records') {
    const record = mockDatabase.wipeRecords.find(item => item.id === id);
    if (!record) {
      throw new Error(`Wipe record with ID ${id} not found`);
    }
    return record;
  }
  return null;
}

export async function Create(path, data) {
  await delay(500);
  const [resource] = path.split('/').slice(2);
  const newId = `rec_${Math.random().toString(36).substr(2, 9)}`;
  const newData = { ...data, id: newId, created_date: new Date().toISOString() };
  if (resource === 'wipe-records') {
    mockDatabase.wipeRecords.push(newData);
    return newData;
  }
  return newData;
}

export async function Update(path, data) {
  await delay(500);
  // This is a simplified mock. It finds the user by ID and updates them.
  const [resource, id] = path.split('/').slice(2);
  if (resource === 'users') {
    const userIndex = mockDatabase.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      mockDatabase.users[userIndex] = { ...mockDatabase.users[userIndex], ...data };
      return mockDatabase.users[userIndex];
    }
  }
  return null;
}

export async function SendEmail({ to, subject, body }) {
  await delay(1000); // Simulate email sending time
  console.log("Mock Email Sent:");
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  return { success: true, message: "Email sent successfully." };
}

export async function UploadFile({ file }) {
  await delay(1500); // Simulate upload time
  const fileUrl = `https://example.com/uploads/${file.name}`;
  console.log(`Mock file uploaded: ${file.name} to ${fileUrl}`);
  return { success: true, file_url: fileUrl };
}