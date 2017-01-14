import * as formatter from 'helpers/formatter'

describe('formatter.js', () => {
  describe('unMergeCells', () => {
    it('should fill all cells of the column given', () => {
      const data = [
        ['Monsieur X', 'Projet 1', '', '0', ''],
        ['', 'Projet 2', '1', '0', ''],
        ['Monsieur Y', 'Projet 3', '1', '1', '1'],
        ['', 'Projet 4', '', '2', ''],
      ]

      expect(formatter.unMergeCells(data, 0)).toEqual([
        ['Monsieur X', 'Projet 1', '', '0', ''],
        ['Monsieur X', 'Projet 2', '1', '0', ''],
        ['Monsieur Y', 'Projet 3', '1', '1', '1'],
        ['Monsieur Y', 'Projet 4', '', '2', ''],
      ])
    })
  })

  describe('getFloat', () => {
    it('should parse a string', () => {
      expect(formatter.getFloat('10,2')).toBe(10.2)
    })

    it('should return null if no value is given', () => {
      expect(formatter.getFloat('')).toBe(null)
    })
  })

  describe('buildWeekStaffing', () => {
    const data = [
      ['Monsieur X', 'Projet 1', '', '0', ''],
      ['Monsieur X', 'Projet 2', '1', '0', ''],
    ]

    beforeEach(() => {
      // We only mock '', 0 and 1 values
      formatter.getFloat = jest.fn((value) => {
        if (value === 0) { return 0 }
        if (value === 1) { return 1 }
        return null
      })
    })

    afterEach(() => {
      formatter.getFloat.mockClear()
    })

    it('should build the first week staffing', () => {
      expect(formatter.buildWeekStaffing(data, 0)).toEqual({
        'Projet 1': null,
        'Projet 2': 1,
        _total: 1,
      })
    })

    it('should build the second week staffing', () => {
      expect(formatter.buildWeekStaffing(data, 1)).toEqual({
        'Projet 1': 0,
        'Projet 2': 0,
        _total: 0,
      })
    })

    it('should build the third week staffing', () => {
      expect(formatter.buildWeekStaffing(data, 2)).toEqual({
        'Projet 1': null,
        'Projet 2': null,
        _total: null,
      })
    })
  })
})
