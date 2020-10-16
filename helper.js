import { MongoClient, ObjectID } from 'mongodb'

class Mongodb {
  constructor() {
    this.uri = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false'
    this.client = new MongoClient(this.uri)
    this.dbName = 'gamepan'
  }

  async InsertMany(collectionName, dataList) {
    try {
      await this.client.connect()
      const database = this.client.db(this.dbName)
      const collection = database.collection(collectionName)
      const result = await collection.insertMany(dataList)
      return result.insertedCount
    } catch (err) {
      throw err
    } finally {
      await this.client.close()
    }
  }

  async InsertOne(collectionName, dataObject) {
    try {
      await this.client.connect()
      const database = this.client.db(this.dbName)
      const collection = database.collection(collectionName)
      const result = await collection.insertOne(dataObject)
      return result.insertedId
    } catch (err) {
      throw err
    } finally {
      await this.client.close()
    }
  }

  async Find(collectionName, query, sort) {
    try {
      await this.client.connect()
      const database = this.client.db(this.dbName)
      const collection = database.collection(collectionName)
      const cursor = collection.find(query).sort(sort)
      const allValues = await cursor.toArray()
      return allValues
    } catch (err) {
      throw err
    } finally {
      await this.client.close()
    }
  }

  async FindOne(collectionName, query) {
    try {
      await this.client.connect()
      const database = this.client.db(this.dbName)
      const collection = database.collection(collectionName)
      const cursor = collection.findOne(query)
      return cursor
    } catch (err) {
      throw err
    } finally {
      await this.client.close()
    }
  }

  async PagingList(collectionName, query, sort, start, perPage) {
    try {
      await this.client.connect()
      const database = this.client.db(this.dbName)
      const collection = database.collection(collectionName)
      const cursor = collection.find(query)
      const total = await cursor.count()
      await cursor.rewind()
      const list = await cursor.sort(sort).limit(perPage).skip(start * perPage).toArray()
      const allValues = {
        list,
        total,
      }
      return allValues
    } catch (err) {
      throw err
    } finally {
      await this.client.close()
    }
  }

  async UpdateOne(collectionName, filter, updateDoc, upsertYn) {
    try {
      await this.client.connect()
      const database = this.client.db(this.dbName)
      const collection = database.collection(collectionName)
      const result = await collection.updateOne(filter, updateDoc, {
        upsert: upsertYn
      })
      return {
        modified: result.modifiedCount,
        upserted: result.upsertedCount
      }
    } catch (err) {
      throw err
    } finally {
      await this.client.close()
    }
  }

  async UpdateMany(collectionName, filter, updateDoc) {
    try {
      await this.client.connect()
      const database = this.client.db(this.dbName)
      const collection = database.collection(collectionName)
      const result = await collection.updateMany(filter, updateDoc)
      return {
        modified: result.modifiedCount
      }
    } catch (err) {
      throw err
    } finally {
      await this.client.close()
    }
  }

  async DeleteOne(collectionName, query) {
    try {
      await this.client.connect()
      const database = this.client.db(this.dbName)
      const collection = database.collection(collectionName)
      const result = await collection.deleteOne(query)
      return result.deletedCount
    } catch (err) {
      throw err
    } finally {
      await this.client.close()
    }
  }

  async DeleteMany(collectionName, query) {
    try {
      await this.client.connect()
      const database = this.client.db(this.dbName)
      const collection = database.collection(collectionName)
      const result = await collection.deleteMany(query)
      return result.deletedCount
    } catch (err) {
      throw err
    } finally {
      await this.client.close()
    }
  }


  /**
   * 데이터 리스트 저장
   * @static InsertMany
   * @param {String} collectionName 컬렉션명
   * @param {Array} dataList 데이터 리스트
   * @returns {Number} insert count
   * @memberof Mongodb
   */
  static async InsertMany(collectionName, dataList) {
    return new Mongodb().InsertMany(collectionName, dataList)
  }

  /**
   * 데이터 저장
   * @static InsertOne
   * @param {String} collectionName 컬렉션명
   * @param {Object} dataObject 데이터
   * @returns {string} insert id
   * @memberof Mongodb
   */
  static async InsertOne(collectionName, dataObject) {
    return new Mongodb().InsertOne(collectionName, dataObject)
  }

  /**
   * 데이터 리스트 불러오기
   * @static Find
   * @param {String} collectionName 컬렉션명
   * @param {Object} query 검색할 쿼리 
   * @param {Object} sort 소팅 -1 내림차순, 1 오름차순
   * @returns {Array} Array List 결과 없을시 []
   * @memberof Mongodb
   */
  static async Find(collectionName, query, sort) {
    return new Mongodb().Find(collectionName, query, sort)
  }

    /**
   * 데이터 불러오기
   * @static FindOne
   * @param {String} collectionName 컬렉션명
   * @param {Object} query 검색할 쿼리
   * @returns {Object} 결과 없을시 null
   * @memberof Mongodb
   */
  static async FindOne(collectionName, query) {
    return new Mongodb().FindOne(collectionName, query)
  }

  /**
   * 페이징 데이터 불러오기
   * @static pagingList
   * @param {String} collectionName 컬렉션명
   * @param {Object} query 검색할 쿼리 
   * @param {Object} sort 소팅 -1 내림차순, 1 오름차순
   * @param {Number} start 페이지. 0부터 시작
   * @param {Number} perPage 보여질 행수
   * @returns {Object} {list: [], total: number}
   * @memberof Mongodb
   */
  static async pagingList(collectionName, query, sort, start, perPage) {
    return new Mongodb().PagingList(collectionName, query, sort, start, perPage)
  }

  /**
   * 한건 업데이트
   * @static UpdateOne
   * @param {String} collectionName 컬렉션명
   * @param {Object} filter 적용할 조건
   * @param {Object} updateDoc 적용할 내용
   * @param {Boolean} upsertYn 데이터 없을시 insert 여부
   * @returns {Object}}  { modified: 변경된 수, upserted: 저장된 수 }
   * @memberof Mongodb
   */
  static async UpdateOne(collectionName, filter, updateDoc, upsertYn) {
    return new Mongodb().UpdateOne(collectionName, filter, updateDoc, upsertYn)
  }

    /**
   * 여러건 업데이트
   * @static UpdateOne
   * @param {String} collectionName 컬렉션명
   * @param {Object} filter 적용할 조건
   * @param {Object} updateDoc 적용할 내용
   * @returns {Number} 적용된 문서 수
   * @memberof Mongodb
   */
  static async UpdateMany(collectionName, filter, updateDoc) {
    return new Mongodb().UpdateMany(collectionName, filter, updateDoc)
  }

  /**
   * 한건 삭제
   * @static DeleteOne
   * @param {String} collectionName 컬렉션명
   * @param {Object} query 검색조건
   * @returns {Number} 삭제된 문서 수
   * @memberof Mongodb
   */
  static async DeleteOne(collectionName, query) {
    return new Mongodb().DeleteOne(collectionName, query)
  }

    /**
   * 여러건 삭제
   * @static DeleteOne
   * @param {String} collectionName 컬렉션명
   * @param {Object} query 검색조건
   * @returns {Number} 삭제된 문서 수
   * @memberof Mongodb
   */
  static async DeleteMany(collectionName, query) {
    return new Mongodb().DeleteMany(collectionName, query)
  }

  /**
   * object id 변환
   *
   * @static ObjectId
   * @param {string} id 아이디
   * @returns ObjectID
   * @memberof Mongodb
   */
  static ObjectId(id) {
    return new ObjectID(id)
  }

}

export default Mongodb
