import { randomBytes } from "crypto";


export class ObjectId {
  private data: Buffer;

  private static random: Buffer = randomBytes(4);
  private static ctr: number = Math.floor(Math.random() * 0xFFFFFF);
  private static previousTimeStamp : BigInt = BigInt(0);

  constructor(type: number, timestamp: number) {
    const buffer = Buffer.alloc(14);

    // 1 byte
    buffer.writeUInt8(type, 0);

    const currentTimeStamp = BigInt(timestamp);

    // We increment counter for different time stamps
    if (currentTimeStamp === ObjectId.previousTimeStamp){
      // Increment counter
      ObjectId.ctr = ObjectId.getNextCounter();
    }
    else{
      //reset counter
      ObjectId.ctr = Math.floor(Math.random() * 0xFFFFFF);
      ObjectId.previousTimeStamp = currentTimeStamp;
    }

    // This temporary buffer will store the time stamp
    const tempBuffer = Buffer.alloc(8);

    tempBuffer.writeBigInt64BE(currentTimeStamp, 0);
    tempBuffer.copy(buffer, 1, 2, 8); // We will copy bytes 2 to 7 (6 bytes) to the ObjectId buffer
    
    ObjectId.random.copy(buffer, 7); // Copy the random bytes to the ObjectId starting at index 7

    buffer.writeUIntBE(ObjectId.ctr, 11, 3)
  
    this.data = buffer;
  }

  static generate(type?: number): ObjectId {
    return new ObjectId(type ?? 0, Date.now());
  }

  toString(encoding?: 'hex' | 'base64'): string {
    return this.data.toString(encoding ?? 'hex');
  }

  private static getNextCounter(): number {
    return (this.ctr = (this.ctr + 1) % 0xFFFFFF);
  }
}