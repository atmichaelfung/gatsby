"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const Promise = require(`bluebird`);

const json2csv = require(`json2csv`);

const _require = require(`../gatsby-node`),
      onCreateNode = _require.onCreateNode;

describe(`Process  nodes correctly`, () => {
  const node = {
    id: `whatever`,
    parent: `SOURCE`,
    children: [],
    extension: `csv`,
    internal: {
      contentDigest: `whatever`,
      mediaType: `text/csv`
    },
    name: `test` // Make some fake functions its expecting.

  };

  const loadNodeContent = node => Promise.resolve(node.content);

  it(`correctly creates nodes from JSON which is an array of objects`,
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(function* () {
    const fields = [`blue`, `funny`];
    const data = [{
      blue: true,
      funny: `yup`
    }, {
      blue: false,
      funny: `nope`
    }];
    const csv = json2csv({
      data: data,
      fields: fields
    });
    node.content = csv;
    const createNode = jest.fn();
    const createParentChildLink = jest.fn();
    const actions = {
      createNode,
      createParentChildLink
    };
    const createNodeId = jest.fn();
    createNodeId.mockReturnValue(`uuid-from-gatsby`);
    yield onCreateNode({
      node,
      loadNodeContent,
      actions,
      createNodeId
    }).then(() => {
      expect(createNode.mock.calls).toMatchSnapshot();
      expect(createParentChildLink.mock.calls).toMatchSnapshot();
      expect(createNode).toHaveBeenCalledTimes(2);
      expect(createParentChildLink).toHaveBeenCalledTimes(2);
    });
  }));
  it(`correctly handles the options object that is passed to it`,
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(function* () {
    node.content = `blue,funny\ntrue,yup\nfalse,nope`;
    const createNode = jest.fn();
    const createParentChildLink = jest.fn();
    const actions = {
      createNode,
      createParentChildLink
    };
    const createNodeId = jest.fn();
    createNodeId.mockReturnValue(`uuid-from-gatsby`);
    yield onCreateNode({
      node,
      loadNodeContent,
      actions,
      createNodeId
    }, {
      noheader: true
    }).then(() => {
      expect(createNode.mock.calls).toMatchSnapshot();
      expect(createParentChildLink.mock.calls).toMatchSnapshot();
      expect(createNode).toHaveBeenCalledTimes(3);
      expect(createParentChildLink).toHaveBeenCalledTimes(3);
    });
  }));
});