import createCommentSchema from './schema'

import {
  CommentBodyBlockCode,
  CommentBodyBlockQuote,
  CommentBodyBlockQuoteParagraph,
  CommentBodyCode,
  CommentBodyContainer,
  CommentBodyHeading,
  CommentBodyList,
  CommentBodyListItem,
  CommentBodyParagraph
} from '../../components/CommentBody/web'
import * as Editorial from '../../components/Typography/Editorial'

const createSchema = ({ ...args } = {}) => {
  return createCommentSchema({
    BlockCode: CommentBodyBlockCode,
    BlockQuote: CommentBodyBlockQuote,
    BlockQuoteParagraph: CommentBodyBlockQuoteParagraph,
    Code: CommentBodyCode,
    Container: CommentBodyContainer,
    Cursive: Editorial.Cursive,
    Emphasis: Editorial.Emphasis,
    Heading: CommentBodyHeading,
    Link: Editorial.A,
    List: CommentBodyList,
    ListItem: CommentBodyListItem,
    Paragraph: CommentBodyParagraph,
    StrikeThrough: Editorial.StrikeThrough,
    ...args
  })
}

export default createSchema
