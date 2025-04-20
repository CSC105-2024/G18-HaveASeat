interface UserData {
  id?: string | number;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
}

const users: Record<string, UserData> = {}
let nextId = 1

export class User {
  static async findByEmail(email: string): Promise<UserData | null> {
    return Object.values(users).find(user => user.email === email) || null
  }

  static async findById(id: string | number): Promise<UserData | null> {
    return users[id as string] || null
  }

  static async create(userData: Omit<UserData, 'id'>): Promise<UserData> {
    const id = String(nextId++)
    const newUser = { ...userData, id }
    users[id] = newUser
    return newUser
  }

  static async findAll(): Promise<UserData[]> {
    return Object.values(users).map(user => {
      const { passwordHash, ...rest } = user
      return rest as UserData
    })
  }
}