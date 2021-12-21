import React, { ForwardRefExoticComponent } from 'react'
import { IconType } from '@react-icons/all-files/lib'
import { BaseEditor, Path } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

type CustomMarks = {
  italic?: boolean
  bold?: boolean
  sub?: boolean
  sup?: boolean
}

export type CustomMarksType = keyof CustomMarks

type PlainText = {
  text: string
  end?: boolean
}

export type CustomText = CustomMarks & PlainText

type SharedElement = {
  children: (CustomElement | CustomText)[]
}

export type ParagraphElement = SharedElement & {
  type: 'paragraph'
}

export type HeadlineElement = SharedElement & {
  type: 'headline'
}

export type BreakElement = SharedElement & {
  type: 'break'
}

export type LinkElement = SharedElement & {
  type: 'link'
  href?: string
}

export type FigureElement = SharedElement & {
  type: 'figure'
}

export type FigureImageElement = SharedElement & {
  type: 'figureImage'
  src?: string
}

export type FigureCaptionElement = SharedElement & {
  type: 'figureCaption'
}

export type FigureBylineElement = SharedElement & {
  type: 'figureByline'
}

export type PullQuoteElement = SharedElement & {
  type: 'pullQuote'
}

export type PullQuoteTextElement = SharedElement & {
  type: 'pullQuoteText'
}

export type PullQuoteSourceElement = SharedElement & {
  type: 'pullQuoteSource'
}

export type CustomElement =
  | HeadlineElement
  | ParagraphElement
  | BreakElement
  | LinkElement
  | FigureElement
  | FigureImageElement
  | FigureCaptionElement
  | FigureBylineElement
  | PullQuoteElement
  | PullQuoteTextElement
  | PullQuoteSourceElement

export type CustomDescendant = CustomElement | CustomText

export type CustomNode = CustomEditor | CustomDescendant

export type CustomElementsType =
  | 'headline'
  | 'paragraph'
  | 'break'
  | 'link'
  | 'figure'
  | 'figureImage'
  | 'figureCaption'
  | 'figureByline'
  | 'pullQuote'
  | 'pullQuoteText'
  | 'pullQuoteSource'

export type ToolbarType = 'hovering' | 'fixed'

interface ButtonI {
  icon: IconType
  small?: boolean
  toolbar: ToolbarType
}

interface EditorAttrsI {
  isVoid?: boolean
  isInline?: boolean
}

interface ElementAttrsI extends EditorAttrsI {
  editUi?: boolean | React.FC
  formatText?: boolean
  disableBreaks?: boolean
}

export type EditorAttr = keyof EditorAttrsI

export type InsertFn = (editor: CustomEditor) => void

export type NormalizeFn<E> = (entry: [E, Path], editor: CustomEditor) => void

export interface NodeConfigI {
  Component: React.FC | ForwardRefExoticComponent
  button?: ButtonI
}

export type MarksConfig = {
  [K in CustomMarksType]: NodeConfigI
}

export type DataFormProps<E> = {
  element: E
  setElement: (el: E) => void
}

export type dataRequiredType<E> = (keyof E)[]

export type TemplateType = CustomElementsType | 'text'

export type NodeTemplate = {
  type: TemplateType | TemplateType[]
  repeat?: boolean
  end?: boolean
}

export interface ElementConfigI extends NodeConfigI {
  insert?: InsertFn
  attrs?: ElementAttrsI
  node?: CustomElement
  DataForm?: DataFormType
  dataRequired?: dataRequiredType
  normalizations?: NormalizeFn[]
  placeholder?: string
  structure?: NodeTemplate[]
}

export type ElementsConfig = {
  [K in CustomElementsType]?: ElementConfigI
}

export interface DraftI {
  title: string
  id: string
  value: CustomElement[]
}

export type EditorConfig = {
  maxSigns: number
}

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}

declare module '@project-r/styleguide'
