import test, { describe } from "node:test"
import assert from "node:assert"
import { encodeSearchText } from "./util"

describe("search encoder", () => {
  describe("English text", () => {
    test("should tokenize simple English words", () => {
      const result = encodeSearchText("hello world")
      assert.deepStrictEqual(result, ["hello", "world"])
    })

    test("should handle multiple spaces", () => {
      const result = encodeSearchText("hello   world")
      assert.deepStrictEqual(result, ["hello", "world"])
    })

    test("should handle tabs and newlines", () => {
      const result = encodeSearchText("hello\tworld\ntest")
      assert.deepStrictEqual(result, ["hello", "world", "test"])
    })

    test("should lowercase all text", () => {
      const result = encodeSearchText("Hello WORLD Test")
      assert.deepStrictEqual(result, ["hello", "world", "test"])
    })
  })

  describe("CJK text", () => {
    test("should tokenize Japanese Hiragana character by character", () => {
      const result = encodeSearchText("こんにちは")
      assert.deepStrictEqual(result, ["こ", "ん", "に", "ち", "は"])
    })

    test("should tokenize Japanese Katakana character by character", () => {
      const result = encodeSearchText("コントロール")
      assert.deepStrictEqual(result, ["コ", "ン", "ト", "ロ", "ー", "ル"])
    })

    test("should tokenize Japanese Kanji character by character", () => {
      const result = encodeSearchText("日本語")
      assert.deepStrictEqual(result, ["日", "本", "語"])
    })

    test("should tokenize Korean Hangul character by character", () => {
      const result = encodeSearchText("안녕하세요")
      assert.deepStrictEqual(result, ["안", "녕", "하", "세", "요"])
    })

    test("should tokenize Chinese characters character by character", () => {
      const result = encodeSearchText("你好世界")
      assert.deepStrictEqual(result, ["你", "好", "世", "界"])
    })

    test("should handle mixed Hiragana/Katakana/Kanji", () => {
      const result = encodeSearchText("て以来")
      assert.deepStrictEqual(result, ["て", "以", "来"])
    })
  })

  describe("Mixed CJK and English", () => {
    test("should handle Japanese with English words", () => {
      const result = encodeSearchText("hello 世界")
      assert.deepStrictEqual(result, ["hello", "世", "界"])
    })

    test("should handle English with Japanese words", () => {
      const result = encodeSearchText("世界 hello world")
      assert.deepStrictEqual(result, ["世", "界", "hello", "world"])
    })

    test("should handle complex mixed content", () => {
      const result = encodeSearchText("これはtest文章です")
      assert.deepStrictEqual(result, ["こ", "れ", "は", "test", "文", "章", "で", "す"])
    })

    test("should handle mixed Korean and English", () => {
      const result = encodeSearchText("hello 안녕 world")
      assert.deepStrictEqual(result, ["hello", "안", "녕", "world"])
    })

    test("should handle mixed Chinese and English", () => {
      const result = encodeSearchText("你好 world")
      assert.deepStrictEqual(result, ["你", "好", "world"])
    })
  })

  describe("Edge cases", () => {
    test("should handle empty string", () => {
      const result = encodeSearchText("")
      assert.deepStrictEqual(result, [])
    })

    test("should handle only whitespace", () => {
      const result = encodeSearchText("   \t\n  ")
      assert.deepStrictEqual(result, [])
    })

    test("should handle single character", () => {
      const result = encodeSearchText("a")
      assert.deepStrictEqual(result, ["a"])
    })

    test("should handle single CJK character", () => {
      const result = encodeSearchText("あ")
      assert.deepStrictEqual(result, ["あ"])
    })

    test("should handle CJK with trailing whitespace", () => {
      const result = encodeSearchText("日本語  ")
      assert.deepStrictEqual(result, ["日", "本", "語"])
    })

    test("should handle English with trailing whitespace", () => {
      const result = encodeSearchText("hello  ")
      assert.deepStrictEqual(result, ["hello"])
    })
  })
})
