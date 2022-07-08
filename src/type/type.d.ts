type Details = Map<string, string>;
export type SpeakerList = Map<number, string | Details>;
type Param = Map<string, Map<string, Map<string, number>>>;

/**
 *
 * WCFClient.dll用インターフェイス
 *
 */

export interface WCFClient_interface {
  /**
   * AssistantSeikaバージョン取得
   * @return {Promise<string>} バージョン文字列
   */
  Version(): Promise<string>;

  /**
   * 製品スキャン
   * @return {Promise<boolean>} True Only
   */
  ProductScan(): Promise<boolean>;

  /**
   * HTTP機能起動
   * @return {Promise<boolean>} True Only
   */
  BootHttpService(): Promise<boolean>;

  /**
   * AssistantSeikaが認識している話者の一覧を取得
   * @return {Promise<SpeakerList>} 話者一覧
   */
  AvatorList(): Promise<SpeakerList>;

  /**
   * AssistantSeikaが認識している話者の少し詳しい一覧を取得
   * @return {Promise<SpeakerList>} 話者一覧
   */
  AvatorList2(): Promise<SpeakerList>;

  /**
   * AssistantSeikaが認識している話者の詳しい一覧を取得
   * @return {Promise<SpeakerList>} 話者一覧
   */
  AvatorListDetail2(): Promise<SpeakerList>;

  /**
   * 指定話者のデフォルトパラメタ取得
   * @param cid 話者のcid
   * @return {Promise<Param>} デフォルトパラメタの一覧
   */
  GetDefaultParams2(cid: number): Promise<Param>;

  /**
   * 指定話者の現在の設定パラメタ取得
   * @param cid 話者のcid
   * @return {Promise<Param>} パラメタの一覧
   */
  GetCurrentParams2(cid: number): Promise<Param>;

  /**
   * 指定話者で発声させる
   * @param cid 話者のcid
   * @param talktext 発声させるテキスト 配列型はすべて結合され一文になる。
   * @param filepath 発声内容を保存するファイル名
   * @param effects 音声効果のパラメタ
   * @param emotions 感情のパラメタ
   * @return {Promise<number>} 発声時間(ms)
   */
  Talk(
    cid: number,
    talktext: string | string[],
    {
      filepath = "",
      effects = [],
      emotions = [],
    }: {
      filepath?: string;
      effects?: [string, number][];
      emotions?: [string, number][];
    }
  ): Promise<number>;

  /**
   * 指定話者で発声させる（非同期）
   * @param cid 話者のcid
   * @param talktext 発声させるテキスト
   * @param effects 音声効果のパラメタ
   * @param emotions 感情のパラメタ
   * @return {Promise<number>} 発声時間(ms)
   */
  TalkAsync(
    cid: number,
    talktext: string | string[],
    {
      effects = [],
      emotions = [],
    }: {
      effects?: [string, number][];
      emotions?: [string, number][];
    }
  ): Promise<number>;
}

/**
 *
 * SeikaSay2.exe用インターフェイス
 *
 */

interface SeikaSay2_interface {
  /**
   * AssistantSeikaバージョン取得
   * @return {Promise<string>} バージョン文字列
   */
  Version(): Promise<string>;

  /**
   * AssistantSeikaが認識している話者の一覧を取得
   * @return {Promise<SpeakerList>} 話者一覧
   */
  AvatorList(): Promise<SpeakerList>;

  /**
   * AssistantSeikaが認識している話者の少し詳しい一覧を取得
   * @return {Promise<SpeakerList>} 話者一覧
   */
  AvatorList2(): Promise<SpeakerList>;

  /**
   * AssistantSeikaが認識している話者の詳しい一覧を取得
   * @return {Promise<SpeakerList>} 話者一覧
   */
  AvatorListDetail2(): Promise<SpeakerList>;

  /**
   * 指定話者のデフォルトパラメタ取得
   * @param cid 話者のcid
   * @return {Promise<Param>} デフォルトパラメタの一覧
   */
  GetDefaultParams2(cid: number): Promise<Param>;

  /**
   * 指定話者の現在の設定パラメタ取得
   * @param cid 話者のcid
   * @return {Promise<Param>} パラメタの一覧
   */
  GetCurrentParams2(cid: number): Promise<Param>;

  /**
   * 指定話者で発声させる
   * @param cid 話者のcid
   * @param talktext 発声させるテキスト 配列型はすべて結合され一文になる。
   * @param filepath 発声内容を保存するファイル名
   * @param effects 音声効果のパラメタ
   * @param emotions 感情のパラメタ
   * @return {Promise<number>} 発声時間(ms)
   */
  Talk(
    cid: number,
    talktext: string | string[],
    {
      filepath = "",
      effects = [],
      emotions = [],
    }: {
      filepath?: string;
      effects?: [string, number][];
      emotions?: [string, number][];
    }
  ): Promise<number>;

  /**
   * 指定話者で発声させる（非同期）
   * @param cid 話者のcid
   * @param talktext 発声させるテキスト
   * @param effects 音声効果のパラメタ
   * @param emotions 感情のパラメタ
   * @return {Promise<number>} 発声時間(ms)
   */
  TalkAsync(
    cid: number,
    talktext: string | string[],
    {
      effects = [],
      emotions = [],
    }: {
      effects?: [string, number][];
      emotions?: [string, number][];
    }
  ): Promise<number>;
}

/**
 *
 * HTTP用インターフェイス
 *
 */

interface HTTP_interface {
  /**
   * AssistantSeikaバージョン取得
   * @return {Promise<string>} バージョン文字列
   */
  Version(): Promise<string>;

  /**
   * AssistantSeikaが認識している話者の一覧を取得
   * @return {Promise<SpeakerList>} 話者一覧
   */
  AvatorList(): Promise<SpeakerList>;

  /**
   * AssistantSeikaが認識している話者の少し詳しい一覧を取得
   * @return {Promise<SpeakerList>} 話者一覧
   */
  AvatorList2(): Promise<SpeakerList>;

  /**
   * AssistantSeikaが認識している話者の詳しい一覧を取得
   * @return {Promise<SpeakerList>} 話者一覧
   */
  AvatorListDetail2(): Promise<SpeakerList>;

  /**
   * 指定話者のデフォルトパラメタ取得
   * @param cid 話者のcid
   * @return {Promise<Param>} デフォルトパラメタの一覧
   */
  GetDefaultParams2(cid: number): Promise<Param>;

  /**
   * 指定話者の現在の設定パラメタ取得
   * @param cid 話者のcid
   * @return {Promise<Param>} パラメタの一覧
   */
  GetCurrentParams2(cid: number): Promise<Param>;

  /**
   * 指定話者で発声させる
   * @param cid 話者のcid
   * @param talktext 発声させるテキスト 配列型はすべて結合され一文になる。
   * @param filepath 発声内容を保存するファイル名
   * @param effects 音声効果のパラメタ
   * @param emotions 感情のパラメタ
   * @return {Promise<number>} 発声時間(ms)
   */
  Talk(
    cid: number,
    talktext: string | string[],
    {
      filepath = "",
      effects = [],
      emotions = [],
    }: {
      filepath?: string;
      effects?: [string, number][];
      emotions?: [string, number][];
    }
  ): Promise<number>;

  /**
   * 指定話者で発声させる（非同期）
   * @param cid 話者のcid
   * @param talktext 発声させるテキスト
   * @param effects 音声効果のパラメタ
   * @param emotions 感情のパラメタ
   * @return {Promise<number>} 発声時間(ms)
   */
  TalkAsync(
    cid: number,
    talktext: string | string[],
    {
      effects = [],
      emotions = [],
    }: {
      effects?: [string, number][];
      emotions?: [string, number][];
    }
  ): Promise<number>;
}
