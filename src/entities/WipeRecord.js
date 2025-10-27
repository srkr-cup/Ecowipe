import { Create, Read, List } from 'integrations/Core'; // Assuming Core has these methods

const WIPE_RECORD_API_ENDPOINT = '/api/wipe-records';

export class WipeRecord {
  static async create(data) {
    // In a real app, this would call a POST API to create a new record.
    return Create(WIPE_RECORD_API_ENDPOINT, data);
  }

  static async get(id) {
    if (!id) {
      throw new Error("Record ID is required");
    }

    try {
      // Attempt to read the record
      const record = await Read(`${WIPE_RECORD_API_ENDPOINT}/${id}`);
      
      if (!record) {
        throw new Error(`No record found with ID ${id}`);
      }

      // Validate required fields
      const requiredFields = ['id', 'device_type', 'operating_system', 'wipe_method'];
      const missingFields = requiredFields.filter(field => !record[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Invalid record data: Missing required fields: ${missingFields.join(', ')}`);
      }

      return record;
    } catch (error) {
      console.error(`Failed to get record ${id}:`, error);
      throw new Error(error.message || 'Failed to retrieve wipe record');
    }
  }

  static async list(sortBy = '-created_date') {
    // Simulates fetching a list of records.
    // In a real app, this would handle sorting and filtering via query parameters.
    const mockRecords = [
      {
        id: "rec123abcde",
        user_name: "Alice Johnson",
        device_type: "laptop",
        operating_system: "windows",
        wipe_method: "military",
        wipe_command: "sdelete -p 7 -z C:",
        proof_screenshot_url: "https://example.com/proof/laptop_proof.png",
        status: "completed",
        eco_points: 100,
        device_size_gb: 512,
        created_date: "2025-09-20T10:00:00Z"
      },
      {
        id: "rec456fghij",
        user_name: "Bob Smith",
        device_type: "hdd",
        operating_system: "linux",
        wipe_method: "deep",
        wipe_command: "shred -vfz -n 3 /dev/sda",
        proof_screenshot_url: "https://example.com/proof/hdd_proof.png",
        status: "pending_proof",
        eco_points: 75,
        device_size_gb: 1000,
        created_date: "2025-09-18T15:30:00Z"
      },
      {
        id: "rec789klmno",
        user_name: "Charlie Brown",
        device_type: "mobile",
        operating_system: "android",
        wipe_method: "quick",
        wipe_command: "adb shell dd if=/dev/zero of=/dev/block/userdata",
        proof_screenshot_url: "https://example.com/proof/mobile_proof.png",
        status: "completed",
        eco_points: 50,
        device_size_gb: 128,
        created_date: "2025-09-15T09:12:00Z"
      },
      {
        id: "rec101pqrst",
        user_name: "Dana Scully",
        device_type: "ssd",
        operating_system: "windows",
        wipe_method: "military",
        wipe_command: "sdelete -p 7 -z C:",
        proof_screenshot_url: "https://example.com/proof/ssd_proof.png",
        status: "completed",
        eco_points: 100,
        device_size_gb: 256,
        created_date: "2025-09-21T18:45:00Z"
      }
    ];

    return new Promise(resolve => setTimeout(() => {
      // Mock sorting
      if (sortBy.includes('created_date')) {
        resolve(mockRecords.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
      } else {
        resolve(mockRecords);
      }
    }, 500));
  }
}